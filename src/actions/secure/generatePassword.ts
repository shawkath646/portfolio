"use server";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/firebase";
import getAddressFromIP from "@/utils/getAddressFromIP";
import { PasswordObjectType } from "@/app/admin/security/PasswordManagement";

interface ServerResponse {
    success: boolean;
    message: string;
    data?: {
        id: string;
        password: string;
        createdAt: Date;
        expiresAt: Date
    };
}

// Function to generate password based on criteria
function createPassword(
    length: number,
    includeUppercase: boolean,
    includeLowercase: boolean,
    includeNumbers: boolean,
    includeSpecial: boolean
): string {
    let charset = '';
    
    if (includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (includeNumbers) charset += '0123456789';
    if (includeSpecial) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    // Always include numbers if no character types are selected
    if (charset === '') {
        charset = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    }
    
    let password = '';
    for (let i = 0; i < length; i++) {
        password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    
    return password;
}

export async function generatePasswordAction(formData: FormData): Promise<ServerResponse> {

    const headerList = await headers();
    const deviceIP = headerList.get('x-forwarded-for') || headerList.get('x-real-ip');

    try {
        // Extract data from FormData
        const site = formData.get('site') as string;
        const length = parseInt(formData.get('length') as string);
        const expireDays = parseInt(formData.get('expireDays') as string);
        const usableTimes = formData.get('usableTimes') as string;
        const includeUppercase = formData.get('includeUppercase') === 'true';
        const includeLowercase = formData.get('includeLowercase') === 'true';
        const includeSpecial = formData.get('includeSpecial') === 'true';
        const includeNumbers = formData.get('includeNumbers') === 'true';

        // Validate required fields
        if (!site || !length || !expireDays || !usableTimes) {
            return {
                success: false,
                message: "Missing required fields",
            };
        }

        // Generate password on server
        const generatedPassword = createPassword(
            length,
            includeUppercase,
            includeLowercase,
            includeNumbers,
            includeSpecial
        );

        const docRef = db.collection("passwords").doc();

        const passwordData: PasswordObjectType = {
            id: docRef.id,
            siteCode: site.toLowerCase().replace(/\s+/g, '-'),
            length,
            usableTimes: usableTimes === 'unlimited' ? 'unlimited' : parseInt(usableTimes),
            password: generatedPassword,
            createdAt: new Date(),
            expiresAt: new Date(Date.now() + expireDays * 24 * 60 * 60 * 1000),
            isUsed: false,
            device: deviceIP && await getAddressFromIP(deviceIP),
            usedTime: 0
        };

        await docRef.set(passwordData);

        // Revalidate the security page to refresh the data
        revalidatePath("/admin/security");

        return {
            success: true,
            message: `Password generated successfully for ${site}`,
            data: {
                id: passwordData.id,
                password: passwordData.password,
                createdAt: passwordData.createdAt,
                expiresAt: passwordData.expiresAt
            }
        };

    } catch (error) {
        return {
            success: false,
            message: error instanceof Error ? error.message : "Unknown error occurred"
        };
    }
}
