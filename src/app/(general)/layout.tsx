import getJsonLd from "@/actions/dataFetch/getJsonLd";
import Footer from "@/components/navigation/Footer";
import Navbar from "@/components/navigation/Navbar";

export default async function GeneralLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const jsonLd = await getJsonLd();

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
                }}
            />
            <Navbar />
            {children}
            <Footer />
        </>
    );
}