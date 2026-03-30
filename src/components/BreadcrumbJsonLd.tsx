"use client";

import { usePathname } from "next/navigation";
import appBaseUrl from "@/data/appBaseUrl";

export default function BreadcrumbJsonLd() {
    const pathname = usePathname();

    if (!pathname || pathname === "/") {
        return null;
    }

    const pathSegments = pathname.split("/").filter((segment) => segment !== "");

    const itemListElement = [
        {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: appBaseUrl,
        },
    ];

    pathSegments.forEach((segment, index) => {
        const urlPath = pathSegments.slice(0, index + 1).join("/");
        const itemUrl = new URL(urlPath, appBaseUrl);

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
        itemListElement: itemListElement,
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
    );
}