"use server";
import { cache } from "react";
import { db } from "@/lib/firebase";
import { timestampToDate } from "@/utils/dateTime";
import { PersonObject, PersonCategory } from "@/types/person.types";

const PERSONS_COLLECTION = db.collection("persons");

// --- Helpers ---
function mapDocToPerson(data: PersonObject): PersonObject {
    return {
        ...data,
        startOn: data.startOn ? timestampToDate(data.startOn) : null,
        endOn: data.endOn ? timestampToDate(data.endOn) : null,
        dob: data.dob ? timestampToDate(data.dob) : null,
        createdAt: timestampToDate(data.createdAt),
        updatedAt: timestampToDate(data.updatedAt),
    };
}

export const getAllPersons = cache(async (category?: PersonCategory): Promise<PersonObject[]> => {
    try {
        let query: FirebaseFirestore.Query = PERSONS_COLLECTION;

        if (category) {
            query = query.where("category", "==", category);
        }

        const snapshot = await query.get();
        if (snapshot.empty) return [];

        // 💡 DRY: Use .map instead of .forEach + push
        const list = snapshot.docs.map(doc => mapDocToPerson(doc.data() as PersonObject));

        return list.sort((a, b) => {
            if (a.startOn && b.startOn) {
                return b.startOn.getTime() - a.startOn.getTime();
            }
            return a.name.localeCompare(b.name);
        });
    } catch (error) {
        console.error("Failed to retrieve persons:", error);
        return [];
    }
});

export const getPersonById = cache(async (id: string): Promise<PersonObject | null> => {
    try {
        const docSnap = await PERSONS_COLLECTION.doc(id).get();
        return docSnap.exists ? mapDocToPerson(docSnap.data() as PersonObject) : null;
    } catch (error) {
        console.error("Failed to retrieve person by ID:", error);
        return null;
    }
});

export const getPersonBySlug = cache(async (slug: string): Promise<PersonObject | null> => {
    try {
        const snapshot = await PERSONS_COLLECTION.where("slug", "==", slug).limit(1).get();
        return snapshot.empty ? null : mapDocToPerson(snapshot.docs[0].data() as PersonObject);
    } catch (error) {
        console.error("Failed to retrieve person by slug:", error);
        return null;
    }
});
