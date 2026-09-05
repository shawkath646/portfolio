import { Metadata } from "next";
import { notFound } from "next/navigation";
import appBaseUrl from "@/data/appBaseUrl";
import { locales, resolveLocale, getLanguagePack, defaultLocale, Locale } from "@/lib/locale";
import { getSkillBySlug, getAllSkillSlugs, getRelatedSkills } from "@/data/skillsData";
import SkillHeader from "./SkillHeader";
import SkillStory from "./SkillStory";
import SkillRelated, { RelatedSkillItem } from "./SkillRelated";

export function generateStaticParams() {
    const params: Array<{ lang: Locale; slug: string }> = [];
    for (const locale of locales) {
        for (const slug of getAllSkillSlugs()) {
            params.push({ lang: locale, slug });
        }
    }
    return params;
}

interface SkillDetailPageProps {
    params: Promise<{
        lang: string;
        slug: string;
    }>;
}

export async function generateMetadata({ params }: SkillDetailPageProps): Promise<Metadata> {
    const { lang, slug } = await params;
    const resolvedLang = resolveLocale(lang);
    const skill = getSkillBySlug(slug);

    if (!skill) {
        return {};
    }

    const [skillsLanguagePack, pageLanguagePack] = await Promise.all([
        getLanguagePack(resolvedLang, "homepage-skills-component"),
        getLanguagePack(resolvedLang, "skills-page"),
    ]);

    const localizedName =
        (skillsLanguagePack[skill.nameKey as keyof typeof skillsLanguagePack] as string) || skill.name;
    const localizedDesc =
        (skillsLanguagePack[skill.descKey as keyof typeof skillsLanguagePack] as string) || "";
    const shortDesc = localizedDesc.slice(0, 160).trim();

    const title = `${localizedName} | ${pageLanguagePack.metaTitleSuffix}`;
    const description = `${pageLanguagePack.metaDescriptionPrefix} ${localizedName}. ${shortDesc}`;

    const languages: Record<string, string> = {};
    for (const l of locales) {
        languages[l] = new URL(`/${l}/about/skills/${slug}`, appBaseUrl).toString();
    }
    languages["x-default"] = new URL(`/${defaultLocale}/about/skills/${slug}`, appBaseUrl).toString();

    return {
        title: {
            absolute: title,
        },
        description,
        alternates: {
            canonical: new URL(`/${resolvedLang}/about/skills/${slug}`, appBaseUrl),
            languages,
        },
        openGraph: {
            title,
            description,
            type: "article",
        },
        twitter: {
            card: "summary",
            title,
            description,
        },
    };
}

export default async function SkillDetailPage({ params }: SkillDetailPageProps) {
    const { lang, slug } = await params;
    const resolvedLang = resolveLocale(lang);
    const skill = getSkillBySlug(slug);

    if (!skill) {
        notFound();
    }

    const [skillsDict, pageDict] = await Promise.all([
        getLanguagePack(resolvedLang, "homepage-skills-component"),
        getLanguagePack(resolvedLang, "skills-page"),
    ]);

    const localizedName =
        (skillsDict[skill.nameKey as keyof typeof skillsDict] as string) || skill.name;
    const localizedBranch =
        (skillsDict[skill.branchKey as keyof typeof skillsDict] as string) || skill.branchSlug;
    const localizedStory =
        (skillsDict[skill.descKey as keyof typeof skillsDict] as string) || "";

    const relatedSkills = getRelatedSkills(skill, 4);
    const relatedItems: RelatedSkillItem[] = relatedSkills.map((item) => ({
        slug: item.slug,
        name: (skillsDict[item.nameKey as keyof typeof skillsDict] as string) || item.name,
        color: item.color,
        learnedYear: item.learnedYear,
    }));

    return (
        <main
            id="main-content"
            tabIndex={-1}
            role="main"
            className="min-h-screen relative bg-linear-to-br from-slate-50 via-blue-50/50 to-indigo-100/60 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/80 py-8 sm:py-12 overflow-hidden"
        >
            {/* Background Decorative Blurs */}
            <div
                className="pointer-events-none absolute -top-24 -left-24 w-80 h-80 rounded-full blur-3xl opacity-25 dark:opacity-15"
                style={{ backgroundColor: skill.bgGlow }}
                aria-hidden="true"
            />
            <div
                className="pointer-events-none absolute bottom-12 right-0 w-80 h-80 rounded-full blur-3xl opacity-20 dark:opacity-10"
                style={{ backgroundColor: skill.bgGlow }}
                aria-hidden="true"
            />

            <div className="container mx-auto px-4 sm:px-6 relative z-10 mt-8 sm:mt-10">
                <SkillHeader
                    slug={skill.slug}
                    localizedName={localizedName}
                    localizedBranch={localizedBranch}
                    learnedYear={skill.learnedYear}
                    color={skill.color}
                    bgGlow={skill.bgGlow}
                    learnedInLabel={pageDict.learnedInLabel}
                    backToSkillsLabel={pageDict.backToSkills}
                    resolvedLang={resolvedLang}
                />

                <SkillStory
                    localizedStory={localizedStory}
                    journeyTitle={pageDict.journeyTitle}
                />

                <SkillRelated
                    items={relatedItems}
                    title={pageDict.otherSkillsTitle}
                    resolvedLang={resolvedLang}
                />
            </div>
        </main>
    );
}
