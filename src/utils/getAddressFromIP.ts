"use server";

export interface AddressType {
    ip: string;
    continent?: string;
    country?: string;
    countryCode?: string;
    region?: string;
    city?: string;
    postalCode?: string;
    latitude?: number;
    longitude?: number;
    timezone?: string;
    isp?: string;
}

/**
 * Look up an IP address and return a normalized address object.
 * Uses the free HTTPS ipwho.is API (no API key required).
 * Note: Requires a runtime with global fetch (Node 18+ or a browser).
 */
export async function getAddressFromIP(ip: string): Promise<AddressType> {

    const url = `https://ipwho.is/${encodeURIComponent(ip)}`;
    const res = await fetch(url, { headers: { accept: "application/json" } });

    if (!res.ok) return { ip };

    const data = await res.json();
    if (!data?.success) return { ip };

    const address: AddressType = {
        ip: data.ip,
        continent: data.continent,
        country: data.country,
        countryCode: data.country_code,
        region: data.region,
        city: data.city,
        postalCode: data.postal ?? data.postal_code ?? data.zip,
        latitude: typeof data.latitude === "number" ? data.latitude : undefined,
        longitude: typeof data.longitude === "number" ? data.longitude : undefined,
        timezone: data.timezone?.id ?? data.timezone,
        isp: data.connection?.isp ?? data.connection?.org,
    };

    return address;
}

export default getAddressFromIP;