import { IconType } from "react-icons";
import { FiSmartphone, FiMonitor, FiGlobe } from "react-icons/fi";
import { PlatformType } from "@/types/common.types";

const allowed: PlatformType[] = ["android", "desktop"];

export function getClientPlatform(headers: Headers): PlatformType {
    const platformHeader = headers.get("x-platform-type")?.toLowerCase();

    if (allowed.includes(platformHeader as PlatformType)) {
        return platformHeader as PlatformType;
    }

    return "web";
}

export function getPlatformIcon(platform: string): IconType {
    switch (platform) {
        case "android": return FiSmartphone;
        case "desktop": return FiMonitor;
        default: return FiGlobe;
    }
}