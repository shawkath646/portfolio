"use server";

import { cache } from "react";
import { Query, QueryDocumentSnapshot } from "firebase-admin/firestore";
import { db } from "@/lib/firebase";
import { PersonObj } from "@/types/common.types";
import { AccessScopeLabel } from "@/types/genericAuth.types";
import { timestampToDate } from "@/utils/dateTime";
import { getAuthSession } from "../authentication/authActions";
import { getGenericAuthSession } from "../genericAuth/authActions";


const dummyPersons: PersonObj[] = [
    {
        id: "p1",
        name: "Ariana",
        slug: "ariana",
        profile: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
        mdxUrl: "https://gist.githubusercontent.com/rt2zz/e0a1d6ab2682d2c47746950b84c0b6ee/raw/83b8b4814c3417111b9b9bef86a552608506603e/markdown-sample.md",
        dateOfBirth: new Date("2002-05-14"),
        meetOn: new Date("2021-09-10"),
        leftOn: null,
        gender: "female",
        relation: ["best friend", "study partner"],
        relatedTo: "friends_corner",
        isLoveTimeline: false,
        timestamp: new Date("2024-01-01")
    },
    {
        id: "p2",
        name: "Rahim",
        slug: "rahim",
        profile: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
        mdxUrl: "https://gist.githubusercontent.com/rt2zz/e0a1d6ab2682d2c47746950b84c0b6ee/raw/83b8b4814c3417111b9b9bef86a552608506603e/markdown-sample.md",
        dateOfBirth: new Date("2001-11-02"),
        meetOn: new Date("2020-03-15"),
        leftOn: null,
        gender: "male",
        relation: ["childhood friend"],
        relatedTo: "friends_corner",
        isLoveTimeline: false,
        timestamp: new Date("2024-02-10")
    },
    {
        id: "p3",
        name: "Sophia",
        slug: "sophia",
        profile: "https://images.unsplash.com/photo-1544005313-94ddf0286df2",
        mdxUrl: "https://gist.githubusercontent.com/rt2zz/e0a1d6ab2682d2c47746950b84c0b6ee/raw/83b8b4814c3417111b9b9bef86a552608506603e/markdown-sample.md",
        dateOfBirth: new Date("2003-08-22"),
        meetOn: new Date("2022-01-05"),
        leftOn: new Date("2023-06-12"),
        gender: "female",
        relation: ["first love"],
        relatedTo: "love_corner",
        isLoveTimeline: true,
        timestamp: new Date("2024-03-05")
    },
    {
        id: "p4",
        name: "Daniel",
        slug: "daniel",
        profile: "https://images.unsplash.com/photo-1527980965255-d3b416303d12",
        mdxUrl: "https://gist.githubusercontent.com/rt2zz/e0a1d6ab2682d2c47746950b84c0b6ee/raw/83b8b4814c3417111b9b9bef86a552608506603e/markdown-sample.md",
        dateOfBirth: null,
        meetOn: new Date("2023-02-18"),
        leftOn: null,
        gender: "male",
        relation: ["gym buddy", "late night talks"],
        relatedTo: "personal_life",
        isLoveTimeline: false,
        timestamp: new Date("2024-04-01")
    },
    {
        id: "p5",
        name: "Nina",
        slug: "nina",
        profile: "https://images.unsplash.com/photo-1517841905240-472988babdf9",
        mdxUrl: "https://gist.githubusercontent.com/rt2zz/e0a1d6ab2682d2c47746950b84c0b6ee/raw/83b8b4814c3417111b9b9bef86a552608506603e/markdown-sample.md",
        dateOfBirth: new Date("2002-12-09"),
        meetOn: new Date("2023-07-01"),
        leftOn: null,
        gender: "female",
        relation: ["special someone"],
        relatedTo: "love_corner",
        isLoveTimeline: true,
        timestamp: new Date("2024-05-15")
    }
];

// function parsePerson(doc: QueryDocumentSnapshot): PersonObj {
//     const data = doc.data() as PersonObj;

//     return {
//         ...data,
//         id: doc.id,
//         dateOfBirth: data.dateOfBirth
//             ? timestampToDate(data.dateOfBirth)
//             : null,
//         meetOn: timestampToDate(data.meetOn),
//         leftOn: data.leftOn
//             ? timestampToDate(data.leftOn)
//             : null,
//         timestamp: timestampToDate(data.timestamp)
//     };
// }

export async function getAllPerson(scope?: AccessScopeLabel) {
    const session = scope
        ? await getGenericAuthSession(scope)
        : await getAuthSession();

    if (!session) {
        throw new Error("Unauthorized");
    }

    return dummyPersons;
}

// const getAllPersonCached = cache(async (scope?: AccessScopeLabel): Promise<PersonObj[]> => {
//     let query: Query = db.collection("persons");

//     if (scope) {
//         query = query.where("scope", "==", scope);
//     }

//     const snapshot = await query.get();

//     return snapshot.docs.map(parsePerson);
// });

// const getPersonBySlugCached = cache(async (slug: string): Promise<PersonObj | null> => {
//     const docRef = await db.collection("persons").where("slug", "==", slug).limit(1).get();
//     if (docRef.empty) return null;

//     return parsePerson(docRef.docs[0]);
// });

export const getPersonBySlug = async (slug: string) => {
    //const data = await getPersonBySlugCached(slug);
    return dummyPersons.filter(i => i.slug === slug)[0];

    // if (!data) return null;

    // const [genericSession, authSession] = await Promise.all([
    //     data.relatedTo
    //         ? getGenericAuthSession(data.relatedTo)
    //         : Promise.resolve(null),
    //     getAuthSession()
    // ]);

    // if (!genericSession && !authSession) {
    //     throw new Error("Unauthorized");
    // }

    // return data;
};
