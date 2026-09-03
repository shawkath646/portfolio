import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPersonBySlug } from "@/actions/person/getPersonData";
import MDXRenderer from "@/components/MDXRenderer";
import appBaseUrl from "@/data/appBaseUrl";
import { locales, resolveLocale, getLanguagePack, defaultLocale } from "@/lib/locale";
import { PersonObj } from "@/types/common.types";
import { PersonObject } from "@/types/person.types";
import PersonBody from "./PersonBody";
import ProfileHeader from "./ProfileHeader";

function mapDbToPersonObj(person: PersonObject): PersonObj {
    return {
        id: person.id,
        name: person.name,
        slug: person.slug,
        profile: person.profilePic || "/default-avatar.png",
        mdxUrl: person.mdxUrl || "",
        shortBio: person.info || undefined,
        dateOfBirth: person.dob,
        meetOn: person.startOn || new Date(),
        leftOn: person.endOn,
        gender: person.gender === "female" ? "female" : "male",
        relation: [person.category],
        relatedTo: person.category === "love corner" ? "love_corner" : "friends_corner",
        isLoveTimeline: person.addToTimeline,
        timestamp: person.createdAt,
    };
}

export async function generateMetadata(props: PageProps<"/[lang]/person/[slug]">): Promise<Metadata> {
    const params = await props.params;
    const resolvedLang = resolveLocale(params.lang);
    const dict = await getLanguagePack(resolvedLang, "person-page");
    const dbPerson = await getPersonBySlug(params.slug);

    if (!dbPerson) {
        return {};
    }

    const personData = mapDbToPersonObj(dbPerson);

    const languages: Record<string, string> = {};
    for (const l of locales) {
        languages[l] = new URL(`/${l}/person/${params.slug}`, appBaseUrl).toString();
    }
    languages["x-default"] = new URL(`/${defaultLocale}/person/${params.slug}`, appBaseUrl).toString();

    return {
        title: `${personData.name} | ${dict.metadataTitleSuffix}`,
        description: personData.shortBio ?? dict.metadataDescription,
        alternates: {
            canonical: new URL(`/${resolvedLang}/person/${params.slug}`, appBaseUrl),
            languages,
        }
    };
}

export default async function PersonPage(props: PageProps<"/[lang]/person/[slug]">) {
    const params = await props.params;
    const resolvedLang = resolveLocale(params.lang);

    const [dbPerson, dict] = await Promise.all([
        getPersonBySlug(params.slug),
        getLanguagePack(resolvedLang, "person-page")
    ]);

    if (!dbPerson) {
        return notFound();
    }

    const personData = mapDbToPersonObj(dbPerson);

    return (
        <main
            id="main-content"
            tabIndex={-1}
            role="main"
            className="relative min-h-screen py-12 sm:py-16"
        >
            <div className="space-y-8 container mx-auto">
                <ProfileHeader person={personData} languagePack={dict} />
                <PersonBody isLoveTimeline={personData.isLoveTimeline} languagePack={dict}>
                    {personData.mdxUrl && <MDXRenderer mdxSource={personData.mdxUrl} lang={resolvedLang} />}
                </PersonBody>
            </div>
        </main>
    );
}