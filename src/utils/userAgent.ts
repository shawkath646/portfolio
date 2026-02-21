export function parseOS(ua: string): string {
    if (ua.includes("Windows NT 10")) return "Windows 10/11";
    if (ua.includes("Windows NT")) return "Windows";
    if (ua.includes("Mac OS X")) return "macOS";
    if (ua.includes("Android")) return "Android";
    if (ua.includes("iPhone") || ua.includes("iPad")) return "iOS";
    if (ua.includes("Linux")) return "Linux";
    if (ua.includes("CrOS")) return "ChromeOS";
    return "Unknown OS";
}

export function parseBrowser(ua: string): string {
    if (ua.includes("Firefox")) return "Firefox";
    if (ua.includes("Edg")) return "Edge";
    if (ua.includes("OPR") || ua.includes("Opera")) return "Opera";
    if (ua.includes("Chrome")) return "Chrome";
    if (ua.includes("Safari")) return "Safari";
    return "Unknown Browser";
}