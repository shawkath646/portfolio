"use server";
import { cache } from "react";
import appBaseUrl from "@/data/appBaseUrl";
import { db } from "@/lib/firebase";
import getSocialLinks from "./getSocialLinks";


interface ImageObject {
  "@type": "ImageObject";
  url: string;
  width: number;
  height: number;
}

interface Organization {
  "@type": "Organization";
  name: string;
  url: string;
  description: string;
}

interface OrganizationRole {
  "@type": "OrganizationRole";
  roleName: string;
  startDate: string;
  worksFor: Organization;
}

type WorksFor = Organization | OrganizationRole;

interface AlumniOf {
  "@type": "CollegeOrUniversity" | "HighSchool";
  name: string;
  sameAs: string;
  department?: string;
}

interface Language {
  "@type": "Language";
  name: string;
  alternateName: string;
}

interface Country {
  "@type": "Country";
  name: string;
}

interface PostalAddress {
  "@type": "PostalAddress";
  addressCountry: string;
  addressLocality: string;
  addressRegion: string;
}

interface WebPage {
  "@type": "WebPage";
  "@id": string;
}

export interface PersonSchema {
  "@type": "Person";
  "@id"?: string;
  name: string;
  alternateName?: string[];
  url: string;
  email: string;
  image: ImageObject | string;
  sameAs?: string[];
  jobTitle?: string[];
  worksFor?: WorksFor[];
  alumniOf?: AlumniOf[];
  hasSkill?: string[];
  knowsLanguage?: Language[];
  description?: string;
  gender?: string;
  birthDate?: string;
  nationality?: Country;
  address?: PostalAddress;
  mainEntityOfPage?: WebPage;
}

export interface WebSiteSchema {
  "@type": "WebSite";
  "@id": string;
  url: string;
  name: string;
  publisher: {
    "@id": string;
  };
}

export interface GraphSchema {
  "@context": "https://schema.org";
  "@graph": [WebSiteSchema, PersonSchema];
}


const getJsonLd = cache(async (): Promise<GraphSchema | null> => {
  try {
    const socialLinks = await getSocialLinks();
    const socialLinksArray = Object.values(socialLinks)
      .filter((link): link is string => typeof link === 'string' && link.trim() !== '');

    const docRef = await db.collection("site-config").doc("jsonLd").get();

    if (!docRef.exists) return null;

    const personData = docRef.data() as PersonSchema;

    const personId = new URL("/#person", appBaseUrl).toString();
    const websiteId = new URL("/#website", appBaseUrl).toString();

    personData["@type"] = "Person";
    personData["@id"] = personId;
    personData.sameAs = [...(personData.sameAs || []), ...socialLinksArray];
    personData.url = appBaseUrl.toString();

    const websiteData: WebSiteSchema = {
      "@type": "WebSite",
      "@id": websiteId,
      url: appBaseUrl.toString(),
      name: personData.name,
      publisher: {
        "@id": personId
      }
    };

    return {
      "@context": "https://schema.org",
      "@graph": [websiteData, personData]
    };
  } catch (error) {
    console.error("Error fetching JSON-LD:", error);
    return null;
  }
});

export default getJsonLd;