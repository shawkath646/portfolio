import { cache } from "react";
import appBaseUrl from "@/data/appBaseUrl";

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
  knowsAbout?: string[];
  knowsLanguage?: Language[];
  description?: string;
  gender?: string;
  birthDate?: string;
  nationality?: Country;
  address?: PostalAddress;
  mainEntityOfPage?: WebPage;
}

interface WebSiteSchema {
  "@type": "WebSite";
  "@id": string;
  url: string;
  name: string;
  publisher: {
    "@id": string;
  };
}

interface GraphSchema {
  "@context": "https://schema.org";
  "@graph": [WebSiteSchema, PersonSchema];
}

const basePersonData: PersonSchema = {
  "@type": "Person",
  name: "Shawkat Hossain Maruf",
  alternateName: ["shawkath646", "SH Maruf"],
  url: appBaseUrl,
  email: "hello@shawkath646.dev",
  image: {
    "@type": "ImageObject",
    url: `${appBaseUrl}/avatar.png`,
    width: 400,
    height: 400,
  },
  jobTitle: [
    "Full-stack Web Developer",
    "Android App Developer",
    "Freelancer/Remote Worker",
    "Computer Science Student",
  ],
  alumniOf: [
    {
      "@type": "CollegeOrUniversity",
      name: "Sejong University",
      sameAs: "https://www.sejong.ac.kr",
      department: "Computer Science and Engineering",
    },
    {
      "@type": "HighSchool",
      name: "Narsingdi Model College",
      sameAs: "https://narsingdimodelcollege.codetreebd.com",
    },
    {
      "@type": "HighSchool",
      name: "Monohardi Government Pilot Model High School",
      sameAs: "http://www.monohardimphs.edu.bd",
    },
  ],
  knowsLanguage: [
    { "@type": "Language", name: "Bengali", alternateName: "bn" },
    { "@type": "Language", name: "English", alternateName: "en" },
    { "@type": "Language", name: "Korean", alternateName: "ko" },
    { "@type": "Language", name: "Hindi", alternateName: "hi" },
  ],
  description:
    "Shawkat Hossain Maruf is a software engineer who enthusiastic about creating robust cloud ecosystems, scalable architectures, and secure web applications. Currently living in Seoul, South Korea, he is studying for degree in Computer Science Engineering at Sejong University.",
  gender: "Male",
  birthDate: "2005-12-30",
  nationality: { "@type": "Country", name: "Bangladesh" },
  address: {
    "@type": "PostalAddress",
    addressCountry: "South Korea",
    addressLocality: "Seoul",
    addressRegion: "Seoul",
  },
  mainEntityOfPage: { "@type": "WebPage", "@id": appBaseUrl },
  worksFor: [
    {
      "@type": "Organization",
      name: "Freelance",
      description: "Independent software development services",
      url: appBaseUrl,
    },
    {
      "@type": "OrganizationRole",
      roleName: "Founder & CEO",
      startDate: "2024-01",
      worksFor: {
        "@type": "Organization",
        name: "clouburstlab",
        description: "AI-based startup software development and digital solutions company",
        url: "https://clouburstlab.com",
      },
    },
  ],
  knowsAbout: [
    "JavaScript",
    "TypeScript",
    "Python",
    "C Programming",
    "CPP",
    "React.js",
    "Next.js",
    "Node.js",
    "React Native",
    "ElectronJS",
    "Firebase",
    "Microsoft Azure",
    "MongoDB",
    "Data Analysis",
    "Machine Learning",
    "UI/UX Design",
    "Cloud Infrastructure",
    "Scalable Applications",
    "Software Engineering"
  ],
};

const getJsonLd = cache((): GraphSchema => {
  const personId = new URL("/#person", appBaseUrl).toString();
  const websiteId = new URL("/#website", appBaseUrl).toString();

  const personData: PersonSchema = {
    ...basePersonData,
    "@id": personId,
    url: appBaseUrl,
    sameAs: [
      ...(basePersonData.sameAs ?? []),
      "mailto:hello@shawkath646.dev",
      "https://fb.shawkath646.dev",
      "https://ig.shawkath646.dev",
      "https://yt.shawkath646.dev",
      "https://tg.shawkath646.dev",
      "https://li.shawkath646.dev",
      "https://gh.shawkath646.dev",
    ],
  };

  const websiteData: WebSiteSchema = {
    "@type": "WebSite",
    "@id": websiteId,
    url: appBaseUrl,
    name: personData.name,
    publisher: { "@id": personId },
  };

  return {
    "@context": "https://schema.org",
    "@graph": [websiteData, personData],
  };
});

export default getJsonLd;