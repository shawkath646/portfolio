import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { 
    checkLoginAbility, 
    generateAttemptMessage, 
    getAdminPassData, 
    saveLoginAttempt,
} from "@/actions/secure/getSiteAccess";
import getAddressFromIP, { AddressType } from "@/utils/getAddressFromIP";

// JWT configuration
const ADMIN_AUTH_SECRET = process.env.ADMIN_AUTH_SECRET as string;
if (!ADMIN_AUTH_SECRET) throw new Error("Error: ADMIN_AUTH_SECRET not found!");

const ACCESS_TOKEN_EXPIRY = "24h";
const REFRESH_TOKEN_EXPIRY = "7d";
const SITE_CODE = "admin-panel" as const;

export async function POST(req: NextRequest) {
    const headersList = await headers();
    
    let clientIP: string | null = null;
    let address: string | AddressType | null = null;
    let userAgent = headersList.get("user-agent") || "unknown";
    let password;

    try {
        try {
            const body = await req.json();
            password = body.password;
        } catch (e) {
            return NextResponse.json({ 
                success: false, 
                message: "Invalid request format. Password JSON body required." 
            }, { status: 400 });
        }
        
        if (!password) {
            return NextResponse.json({
                success: false,
                message: "Password is required"
            }, { status: 400 });
        }

        const rawIP = headersList.get("x-forwarded-for") || headersList.get("x-real-ip");
        clientIP = rawIP ? rawIP.split(',')[0].trim() : null;

        if (!clientIP || clientIP === "unknown") {
            return NextResponse.json({
                success: false,
                message: "Unable to determine client IP address."
            }, { status: 400 });
        }
        
        address = await getAddressFromIP(clientIP);

        const loginStatus = await checkLoginAbility(clientIP, SITE_CODE);

        if (!loginStatus.allowed) {
            const lockoutMessage = await generateAttemptMessage(loginStatus);
            
            await saveLoginAttempt({
                ip: clientIP,
                userAgent,
                success: false,
                siteCode: SITE_CODE,
                isAdministrator: true,
                timestamp: new Date(),
                failedReason: "IP Locked Out",
                address
            });

            return NextResponse.json({ success: false, message: lockoutMessage }, { status: 403 });
        }

        const adminPassData = await getAdminPassData();

        if (adminPassData.blockedIPs.includes(clientIP)) {
            await saveLoginAttempt({
                ip: clientIP, userAgent, success: false, siteCode: SITE_CODE, isAdministrator: true,
                timestamp: new Date(), failedReason: "IP is blocked", address
            });

            return NextResponse.json({
                success: false,
                message: "Access from your IP has been blocked."
            }, { status: 403 });
        }

        // --- 5. Password Verification ---
        const passwordMatch = await bcrypt.compare(password, adminPassData.password);
        
        if (!passwordMatch) {
            await saveLoginAttempt({
                ip: clientIP, userAgent, success: false, siteCode: SITE_CODE, isAdministrator: true,
                timestamp: new Date(), failedReason: "Invalid admin credentials", address
            });

            const updatedStatus = await checkLoginAbility(clientIP, SITE_CODE);
            const attemptMessage = await generateAttemptMessage(updatedStatus);

            return NextResponse.json({
                success: false,
                message: `Invalid admin credentials. ${attemptMessage}`
            }, { status: 401 });
        }

        // --- 6. SUCCESS: Generate Tokens & Log ---
        
        const { docId: loginAttemptId, update } = await saveLoginAttempt({
            ip: clientIP, 
            userAgent, 
            success: true, 
            siteCode: SITE_CODE, 
            isAdministrator: true,
            timestamp: new Date(), 
            address
        });
        
        // Generate access token (short-lived)
        const accessToken = jwt.sign({ 
            loginAttemptId,
            isAdministrator: true,
            clientIp: clientIP,
            tokenType: 'access',
        }, ADMIN_AUTH_SECRET, {
            expiresIn: ACCESS_TOKEN_EXPIRY
        });
        
        // Generate refresh token (long-lived)
        const refreshToken = jwt.sign({ 
            loginAttemptId,
            isAdministrator: true,
            tokenType: 'refresh',
        }, ADMIN_AUTH_SECRET, {
            expiresIn: REFRESH_TOKEN_EXPIRY
        });

        // Calculate expiry times for client reference
        const accessExpiresAt = new Date();
        accessExpiresAt.setHours(accessExpiresAt.getHours() + 24); // 24 hours from now
        
        const refreshExpiresAt = new Date();
        refreshExpiresAt.setDate(refreshExpiresAt.getDate() + 7); // 7 days from now

        // Save tokens in database
        await update({ 
            tokens: { 
                accessToken, 
                refreshToken, 
                expireAt: accessExpiresAt 
            } 
        });

        // --- 7. Return tokens in JSON response (for Android App) ---
        return NextResponse.json({
            success: true,
            message: "Authentication successful",
            data: {
                accessToken,
                refreshToken,
                accessExpiresAt: accessExpiresAt.toISOString(),
                refreshExpiresAt: refreshExpiresAt.toISOString()
            }
        }, { status: 200 });

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Internal server error";
        console.error("Authentication Error:", error);

        // Log the error safely using known variables or fallbacks
        const finalIp = clientIP || "unknown";
        const finalAddress = address || "unknown";

        await saveLoginAttempt({
            ip: finalIp, userAgent, success: false, siteCode: SITE_CODE, isAdministrator: true,
            timestamp: new Date(), failedReason: `Internal Error: ${errorMessage}`, address: finalAddress
        });

        return NextResponse.json({
            success: false,
            message: "An internal server error occurred during authentication."
        }, { status: 500 });
    }
}
