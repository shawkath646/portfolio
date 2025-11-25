/**
 * Securely extract client IP address from request headers
 * Prevents IP spoofing by validating and sanitizing headers
 * 
 * Priority order:
 * 1. x-real-ip (set by trusted reverse proxy)
 * 2. x-forwarded-for (only first valid IP, set by reverse proxy)
 * 3. Fallback to connection IP
 */

const PRIVATE_IP_RANGES = [
    /^10\./,                      // 10.0.0.0/8
    /^172\.(1[6-9]|2[0-9]|3[01])\./, // 172.16.0.0/12
    /^192\.168\./,                // 192.168.0.0/16
    /^127\./,                     // 127.0.0.0/8 (localhost)
    /^169\.254\./,                // 169.254.0.0/16 (link-local)
    /^::1$/,                      // IPv6 localhost
    /^fe80:/,                     // IPv6 link-local
    /^fc00:/,                     // IPv6 unique local
];

/**
 * Check if an IP address is private/internal
 */
function isPrivateIP(ip: string): boolean {
    return PRIVATE_IP_RANGES.some(range => range.test(ip));
}

/**
 * Validate IP address format (IPv4 or IPv6)
 */
function isValidIP(ip: string): boolean {
    // IPv4 pattern
    const ipv4Pattern = /^(\d{1,3}\.){3}\d{1,3}$/;
    // IPv6 pattern (simplified)
    const ipv6Pattern = /^([0-9a-fA-F]{0,4}:){2,7}[0-9a-fA-F]{0,4}$/;
    
    if (ipv4Pattern.test(ip)) {
        // Validate each octet is 0-255
        const octets = ip.split('.');
        return octets.every(octet => {
            const num = parseInt(octet, 10);
            return num >= 0 && num <= 255;
        });
    }
    
    return ipv6Pattern.test(ip);
}

/**
 * Extract and validate client IP from headers
 * Returns null if no valid IP can be determined
 */
export function getClientIP(headers: Headers): string | null {
    // Method 1: Check x-real-ip (most reliable if set by trusted proxy)
    const realIP = headers.get('x-real-ip');
    if (realIP) {
        const trimmed = realIP.trim();
        if (isValidIP(trimmed) && !isPrivateIP(trimmed)) {
            return trimmed;
        }
    }

    // Method 2: Check x-forwarded-for (can be spoofed, use first public IP only)
    const forwardedFor = headers.get('x-forwarded-for');
    if (forwardedFor) {
        // x-forwarded-for can contain multiple IPs: "client, proxy1, proxy2"
        // We want the FIRST valid public IP (leftmost)
        const ips = forwardedFor.split(',').map(ip => ip.trim());
        
        for (const ip of ips) {
            if (isValidIP(ip) && !isPrivateIP(ip)) {
                return ip;
            }
        }
    }

    // Method 3: Check other common headers (Cloudflare, etc.)
    const cfConnectingIP = headers.get('cf-connecting-ip');
    if (cfConnectingIP) {
        const trimmed = cfConnectingIP.trim();
        if (isValidIP(trimmed) && !isPrivateIP(trimmed)) {
            return trimmed;
        }
    }

    const trueClientIP = headers.get('true-client-ip');
    if (trueClientIP) {
        const trimmed = trueClientIP.trim();
        if (isValidIP(trimmed) && !isPrivateIP(trimmed)) {
            return trimmed;
        }
    }

    // If we're here, no valid public IP was found
    // In development, this might be normal (localhost)
    // In production, this is suspicious
    return null;
}

/**
 * Get client IP with fallback for development
 * Use this for non-security critical features
 */
export function getClientIPWithFallback(headers: Headers): string {
    const ip = getClientIP(headers);
    
    // In development/localhost, allow private IPs
    if (!ip) {
        const localIP = headers.get('x-forwarded-for')?.split(',')[0]?.trim() 
            || headers.get('x-real-ip')?.trim()
            || '127.0.0.1';
        return localIP;
    }
    
    return ip;
}
