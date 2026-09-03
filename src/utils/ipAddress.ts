import { cache } from "react";
import { AddressType } from "@/types/common.types";

const IPV4_REGEX = /^(\d{1,3}\.){3}\d{1,3}$/;
const IPV6_REGEX = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$|^([0-9a-fA-F]{1,4}:){1,7}:|^([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}$|^([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}$|^([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}$|^([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}$|^([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}$|^[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)$|^::1$|^fe80:/;

const PRIVATE_IP_RANGES = [
    /^10\./,
    /^172\.(1[6-9]|2[0-9]|3[01])\./,
    /^192\.168\./,
    /^127\./,
    /^169\.254\./,
    /^::1$/,
    /^fe80:/,
    /^fc00:/,
];

// Cloudflare proxy headers (authoritative when behind Cloudflare proxy)
const CLOUDFLARE_IP_HEADERS = [
    "cf-connecting-ip",
    "true-client-ip",
];

// Fallback headers for non-Cloudflare environments, custom proxies, and direct local access
const FALLBACK_IP_HEADERS = [
    "x-real-ip",
    "x-forwarded-for",
    "x-client-ip",
    "fastly-client-ip",
    "x-cluster-client-ip",
    "forwarded-for",
    "x-forwarded",
];


function isPrivateIP(ip: string): boolean {
    return PRIVATE_IP_RANGES.some((range) => range.test(ip));
}

function isValidIP(ip: string): boolean {
    if (IPV4_REGEX.test(ip)) {
        return ip.split(".").every((octet) => {
            const num = parseInt(octet, 10);
            return num >= 0 && num <= 255;
        });
    }
    return IPV6_REGEX.test(ip);
}

function extractValidIP(headerValue: string | null, isDev: boolean): string | null {
    if (!headerValue) return null;

    const parts = headerValue.split(",");
    for (const part of parts) {
        const ip = part.trim();
        if (isValidIP(ip)) {
            if (isDev) return ip;
            if (!isPrivateIP(ip)) return ip;
        }
    }

    return null;
}

export function getClientIP(headers: Headers): string | null {
    const isDev = process.env.NODE_ENV === "development";

    // 1. Authoritative: Fetch from Cloudflare proxy headers first
    for (const header of CLOUDFLARE_IP_HEADERS) {
        const ip = extractValidIP(headers.get(header), isDev);
        if (ip) return ip;
    }

    // 2. Fallback: Check remaining proxy and forwarding headers
    for (const header of FALLBACK_IP_HEADERS) {
        const ip = extractValidIP(headers.get(header), isDev);
        if (ip) return ip;
    }

    if (isDev) {
        return "127.0.0.1";
    }

    return null;
}

export const getAddressFromIP = cache(async (ip: string): Promise<AddressType | null> => {
    const url = `https://ipwho.is/${encodeURIComponent(ip)}`;
    const res = await fetch(url, { headers: { accept: "application/json" } });

    if (!res.ok) return null;

    const data = await res.json();
    if (!data?.success) return null;

    const address: AddressType = {
        street: `isp: ${data.connection?.isp ?? data.connection?.org}\n,
        langtitude: ${typeof data.latitude === "number" ? data.latitude : undefined}\n
        longtitude: ${typeof data.longitude === "number" ? data.longitude : undefined}`,
        continent: data.continent,
        country: data.country,
        countryCode: data.country_code,
        region: data.region,
        city: data.city,
        postalCode: data.postal ?? data.postal_code ?? data.zip,
        timezone: data.timezone?.id ?? data.timezone,
    };

    return address;
});