import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPersonBySlug } from "@/actions/mixed/getPersonData";
import MDXRenderer from "@/components/MDXRenderer";
import appBaseUrl from "@/data/appBaseUrl";
import { locales, resolveLocale, getLanguagePack, defaultLocale } from "@/lib/locale";
import PersonBody from "./PersonBody";
import ProfileHeader from "./ProfileHeader";

export async function generateMetadata(props: PageProps<"/[lang]/person/[slug]">): Promise<Metadata> {
    const params = await props.params;
    const resolvedLang = resolveLocale(params.lang);
    const dict = await getLanguagePack(resolvedLang, "person-page");
    const personData = await getPersonBySlug(params.slug);

    if (!personData) {
        return {};
    }

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

    const [personData, dict] = await Promise.all([
        getPersonBySlug(params.slug),
        getLanguagePack(resolvedLang, "person-page")
    ]);

    if (!personData) {
        return notFound();
    }

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