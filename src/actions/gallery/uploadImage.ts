"use server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/firebase";
import uploadFileToFirestore from "@/actions/storage/uploadFileToFirestore";
import { PartialBy } from "@/types";


export interface GalleryImageType {
    id: string;
    title: string;
    description: string;
    location: string;
    alt: string;
    timestamp: Date;
    src: string;
    height: number;
    width: number;
}

const uploadImage = async (albumId: string, imageProps: PartialBy<GalleryImageType, "id">) => {
    const docRef = db.collection("gallery").doc(albumId).collection("images").doc();

    const downloadUrl = await uploadFileToFirestore(imageProps.src, docRef.id);

    const imageObject: GalleryImageType = {
        ...imageProps,
        id: docRef.id,
        src: downloadUrl,
    };

    docRef.set(imageObject);
    revalidatePath("/admin/gallery");
    return docRef.id;
};

export default uploadImage;