"use server";
import { cache } from "react";
import { AddressType } from "@/types";


const getAddressFromIP = cache(async(ip: string): Promise<AddressType | null> => {

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

export default getAddressFromIP;