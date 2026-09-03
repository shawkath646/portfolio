import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "My Life",
    description: "// fill it",
}

export default async function Page() {
    return (
        <div>My life
            <Link href="/admin/life/add-person">Add person</Link>
        </div>
    );
}