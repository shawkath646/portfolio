import { Metadata } from "next";
import FriendsCornerContent from "./FriendsCornerContent";

export const metadata: Metadata = {
    title: 'Friends Corner',
    description: 'A special corner dedicated to cherished friendships, shared memories, and the bonds that make life meaningful.',
    keywords: ['friends', 'friendship', 'memories', 'connections', 'personal'],
    openGraph: {
        title: 'Friends Corner - Shawkat Hossain Maruf',
        description: 'A special corner dedicated to cherished friendships, shared memories, and the bonds that make life meaningful.',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Friends Corner - Shawkat Hossain Maruf',
        description: 'A special corner dedicated to cherished friendships, shared memories, and the bonds that make life meaningful.',
    },
};

export default function FriendsCornerPage() {
    return <FriendsCornerContent />;
}
