import { notFound } from "next/navigation";
import { getPersonBySlug } from "@/actions/mixed/getPersonData";
import MDXRenderer from "@/components/MDXRenderer";
import PersonBody from "./PersonBody";
import ProfileHeader from "./ProfileHeader";

export default async function PersonPage(props: PageProps<"/[lang]/person/[slug]">) {
    const params = await props.params;

    const personData = await getPersonBySlug(params.slug);

    console.log(params)

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
                <ProfileHeader person={personData} />
                <PersonBody isLoveTimeline={personData.isLoveTimeline}>
                    {personData.mdxUrl && <MDXRenderer mdxSource={personData.mdxUrl} />}
                </PersonBody>
            </div>
        </main>
    );
}