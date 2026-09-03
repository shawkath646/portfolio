import { Metadata } from "next";
import { getPersonById } from "@/actions/person/getPersonData";
import AddPersonForm from "./AddPersonForm";
import { getSingleSearchParam } from "@/utils/string";

export const metadata: Metadata = {
    title: "Add Person",
    description: "Add a person to your friends list or love corner timeline.",
};

export default async function AddPersonPage({ searchParams }: PageProps<"/admin/life/add-person">) {
    const params = await searchParams;
    const editId = getSingleSearchParam(params.e);

    const personData = editId ? await getPersonById(editId) : null;

    return (
        <main
            id="main-content"
            tabIndex={-1}
            role="main"
            aria-label="Add person admin page content"
            className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 py-8 px-4 sm:px-6 lg:px-8"
        >
            <div className="container mx-auto max-w-7xl">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
                        <span className="bg-linear-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                            {personData ? "Edit Person" : "Add Person"}
                        </span>
                    </h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        {personData
                            ? `Edit details for ${personData.name}.`
                            : "Add a new entry to your friends collection or love corner timeline database."}
                    </p>
                </div>

                <AddPersonForm personData={personData} />
            </div>
        </main>
    );
}
