"use server";
import { cache } from "react";
import getSocialLinks from "./getSocialLinks";
import { db } from "@/lib/firebase";

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

interface PersonSchema {
  "@context": "https://schema.org";
  "@type": "Person";
  name: string;
  alternateName: string[];
  url: string;
  email: string;
  image: ImageObject;
  sameAs: string[];
  jobTitle: string[];
  worksFor: WorksFor[];
  alumniOf: AlumniOf[];
  hasSkill: string[];
  knowsLanguage: Language[];
  description: string;
  gender: string;
  birthDate: string;
  nationality: Country;
  address: PostalAddress;
  mainEntityOfPage: WebPage;
}

const getJsonLd = cache(async () => {
  const socialLinks = await getSocialLinks();  
  const socialLinksArray = Object.values(socialLinks)
    .filter((link): link is string => typeof link === 'string' && link.trim() !== '');

  const docRef = await db.collection("site-config").doc("jsonLd").get();
  const jsonLd = docRef.data() as PersonSchema;
  
  jsonLd.sameAs = [...(jsonLd.sameAs || []), ...socialLinksArray];
  
  return jsonLd;
});

export default getJsonLd;
