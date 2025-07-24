import BuyMeACoffee from "./BuyMeACoffee";
import Connections from "./Connections";
import ContactForm from "./ContactForm";

export default async function ContactPage() {
    return (
        <main className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-purple-100 dark:from-[#0a192f] dark:via-[#1e293b] dark:to-[#0f172a] pt-22 pb-10 px-3">
            <Connections />
            <BuyMeACoffee />
            <ContactForm />
        </main>
    );
};