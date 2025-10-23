import { NextRequest, NextResponse } from "next/server";
import { saveLoginAttempt, TokensType } from "@/actions/secure/getSiteAccess";
import getAddressFromIP from "@/utils/getAddressFromIP";
import { verifyToken, generateTokens, TokenPayload } from "@/utils/auth/tokenUtils";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { refreshToken } = body;
        
        if (!refreshToken) {
            return NextResponse.json({ 
                success: false, 
                message: "Refresh token is required" 
            }, { status: 400 });
        }
        
        const decodedToken = verifyToken(refreshToken);
        
        if (!decodedToken) {
            return NextResponse.json({ 
                success: false, 
                message: "Invalid or expired refresh token" 
            }, { status: 401 });
        }
            
        // Check if the token is meant for client app
        if (decodedToken.origin !== "clientapp") {
            return NextResponse.json({ 
                success: false, 
                message: "Invalid token origin" 
            }, { status: 401 });
        }
        
        // Check if user is admin (required for client app)
        if (!decodedToken.isAdministrator) {
            return NextResponse.json({ 
                success: false, 
                message: "Insufficient permissions" 
            }, { status: 403 });
        }
        
        // Generate new tokens
        const { tokens, plainTokens } = generateTokens(true, "clientapp");
        
        // Get client info
        const clientIP = req.headers.get("x-forwarded-for") || 
                       req.headers.get("x-real-ip") || 
                       "unknown";
        const userAgent = req.headers.get("user-agent") || "unknown";
        const address = await getAddressFromIP(clientIP);
        
        // Log refresh token usage
        await saveLoginAttempt({
            ip: clientIP,
            userAgent,
            success: true,
            siteCode: "admin",
            isAdministrator: true,
            timestamp: new Date(),
            address,
            origin: "clientapp",
            tokens,
            failedReason: "Token refresh"
        });
        
        // Return new tokens
        return NextResponse.json({
            success: true,
            message: "Tokens refreshed successfully",
            data: {
                tokens: plainTokens
            }
        });
    } catch (error) {
        console.error("Token refresh error:", error);
        
        return NextResponse.json({ 
            success: false, 
            message: "An error occurred during token refresh" 
        }, { status: 500 });
    }
}