import { Metadata } from "next";
import { notFound } from "next/navigation";
import { FiLock } from "react-icons/fi";
import { getAuthSession } from "@/actions/authentication/authSession";
import { getGenericAuthSession } from "@/actions/genericAuth/authSession";
import { getPersonBySlug } from "@/actions/person/getPersonData";
import MDXRenderer from "@/components/MDXRenderer";
import RestrictedPageLogin from "@/components/RestrictedPageLogin";
import { isRouteAllowed } from "@/data/site_scopes";
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
    const dbPerson = await getPersonBySlug(params.slug);

    if (!dbPerson) {
        return {};
    }

    const title = dbPerson.name;
    const description = `Read ${dbPerson.name} according to Shawkat Hossain Maruf's perspective, how he know, work relation etc.`;

    const languages: Record<string, string> = {};
    for (const l of locales) {
        languages[l] = new URL(`/${l}/person/${params.slug}`, appBaseUrl).toString();
    }
    languages["x-default"] = new URL(`/${defaultLocale}/person/${params.slug}`, appBaseUrl).toString();

    return {
        title,
        description,
        alternates: {
            canonical: new URL(`/${resolvedLang}/person/${params.slug}`, appBaseUrl),
            languages,
        },
        openGraph: {
            title,
            description,
            type: "profile",
        },
        twitter: {
            card: "summary",
            title,
            description,
        },
    };
}

export default async function PersonPage(props: PageProps<"/[lang]/person/[slug]">) {
    const params = await props.params;
    const resolvedLang = resolveLocale(params.lang);

    const [dbPerson, dict, adminSession, genericSession] = await Promise.all([
        getPersonBySlug(params.slug),
        getLanguagePack(resolvedLang, "person-page"),
        getAuthSession(),
        getGenericAuthSession(),
    ]);

    if (!dbPerson) {
        return notFound();
    }

    const parentPath = dbPerson.category === "friends" ? "/about/friends-corner" : "/about/love-corner";
    const specificRoute = `${parentPath}/${params.slug}`;

    const isAuthorized = !!adminSession || (
        !!genericSession && (
            isRouteAllowed(genericSession.allowedRoutes, specificRoute) ||
            isRouteAllowed(genericSession.allowedRoutes, `/person/${params.slug}`)
        )
    );

    if (!isAuthorized) {
        // Intentionally revealed path and index for search engines with strict PII limitation:
        // Exposes only name and generic description; blocks all sensitive PII and MDX behind password authentication
        const genericDescription = `Read ${dbPerson.name} according to Shawkat Hossain Maruf's perspective, how he know, work relation etc.`;
        const restrictedDict = await getLanguagePack(resolvedLang, "restricted-page-login-component");

        return (
            <RestrictedPageLogin
                accessScope={specificRoute}
                title={dbPerson.name}
                description={genericDescription}
                icon={<FiLock className="text-2xl text-white" />}
                languagePack={restrictedDict}
            />
        );
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