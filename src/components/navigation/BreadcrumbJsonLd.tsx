"use client";

import { usePathname } from "next/navigation";
import { isLocale } from "@/lib/locale";
import appBaseUrl from "@/data/appBaseUrl";

interface BreadcrumbJsonLdProps {
    homeName?: string;
}

export default function BreadcrumbJsonLd({ homeName = "Home" }: BreadcrumbJsonLdProps) {
    const pathname = usePathname();

    if (!pathname || pathname === "/") {
        return null;
    }

    let pathSegments = pathname.split("/").filter(Boolean);

    let locale = null;
    const firstSegment = pathSegments[0];
    if (firstSegment && isLocale(firstSegment)) {
        locale = firstSegment;
        pathSegments = pathSegments.slice(1);
    }

    const baseUrl = locale
        ? `${appBaseUrl}/${locale}`
        : appBaseUrl;

    const itemListElement = [
        {
            "@type": "ListItem",
            position: 1,
            name: homeName,
            item: baseUrl,
        },
    ];

    pathSegments.forEach((segment, index) => {
        const urlPath = pathSegments.slice(0, index + 1).join("/");
        const itemUrl = `${baseUrl}/${urlPath}`;

        const cleanName = segment
            .replace(/-/g, " ")
            .replace(/\b\w/g, (char) => char.toUpperCase());

        itemListElement.push({
            "@type": "ListItem",
            position: index + 2,
            name: cleanName,
            item: itemUrl,
        });
    });

    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement,
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
                __html: JSON.stringify(breadcrumbSchema),
            }}
        />
    );
}