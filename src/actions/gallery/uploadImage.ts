"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/firebase";
import uploadFileToFirestore from "@/actions/storage/uploadFileToFirestore";
import { PartialBy } from "@/types";
import { GalleryImageType } from "./saveGalleryImage";

/**
 * @deprecated Use generateGalleryUploadURL and saveGalleryImage instead for direct browser uploads
 */
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
export type { GalleryImageType };