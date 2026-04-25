"use server";
import { cache } from "react";
import { FieldPath, DocumentSnapshot } from "firebase-admin/firestore";
import { db } from "@/lib/firebase";
import {
    GalleryAlbumType,
    GalleryImageType,
    GetAlbumsResponse,
    GetImagesResponse
} from "@/types/gallery.types";
import { applyStartAfterCursor, encodeCursor, getCursorPageNumber, getPreviousCursor } from "@/utils/cursor";
import { timestampToDate } from "@/utils/dateTime";

const ALBUMS_PAGE_LIMIT = 18;
const IMAGES_PAGE_LIMIT = 20;



const getOrderedQuery = (collectionName: string) =>
    db
        .collection(collectionName)
        .orderBy("timestamp", "desc")
        .orderBy(FieldPath.documentId(), "desc");

const normalizeImageData = (doc: DocumentSnapshot): GalleryImageType => {
    const imageData = doc.data() as GalleryImageType;
    
    return {
        ...imageData,
        timestamp: timestampToDate(imageData.timestamp),
        images: imageData.images.map(img => ({
            ...img,
            timestamp: timestampToDate(img.timestamp)
        }))
    };
};

const getUnknownAlbum = cache(async (): Promise<GalleryAlbumType> => {
    const imagesQuery = db
        .collection("gallery-images")
        .where("albumId", "==", null)
        .orderBy("timestamp", "desc");

    const [countSnapshot, previewSnapshot] = await Promise.all([
        imagesQuery.count().get(),
        imagesQuery.limit(5).get()
    ]);

    const unknownCount = countSnapshot.data().count;


    const previewImages = previewSnapshot.docs.map(doc => doc.id);

    return {
        id: "unknown-album",
        name: "Unknown Album",
        imageCount: unknownCount,
        slug: "unknown-album",
        previewImages,
        timestamp: new Date(0)
    };
});

export const getAllAlbums = cache(
    async (startAfter?: string): Promise<GetAlbumsResponse> => {
        const baseQuery = getOrderedQuery("gallery-albums");

        const [totalSnapshot, page, pagedSnapshot] = await Promise.all([
            baseQuery.count().get(),
            getCursorPageNumber(baseQuery, startAfter, ALBUMS_PAGE_LIMIT),
            applyStartAfterCursor(baseQuery, startAfter)
                .limit(ALBUMS_PAGE_LIMIT + 1)
                .get(),
        ]);

        const hasMore = pagedSnapshot.docs.length > ALBUMS_PAGE_LIMIT;
        const docs = hasMore
            ? pagedSnapshot.docs.slice(0, ALBUMS_PAGE_LIMIT)
            : pagedSnapshot.docs;

        const albums: GalleryAlbumType[] = docs.map((doc) => {
            const album = doc.data() as GalleryAlbumType;
            album.timestamp = timestampToDate(album.timestamp);
            return album;
        });

        const unknownAlbum = !hasMore ? await getUnknownAlbum() : null;
        const hasUnknown = (unknownAlbum?.imageCount ?? 0) > 0;
        if (hasUnknown && unknownAlbum) albums.push(unknownAlbum);

        const firestoreTotal = totalSnapshot.data().count;
        const totalItems = firestoreTotal + (hasUnknown ? 1 : 0);
        const totalPages = Math.max(1, Math.ceil(totalItems / ALBUMS_PAGE_LIMIT));

        const nextStartAfter =
            hasMore && docs.length > 0
                ? encodeCursor(docs[docs.length - 1])
                : undefined;

        const hasPrev = !!startAfter;
        const prevStartAfter = hasPrev && pagedSnapshot.docs.length > 0
            ? await getPreviousCursor(baseQuery, pagedSnapshot.docs[0], ALBUMS_PAGE_LIMIT)
            : undefined;

        return {
            albums,
            limit: ALBUMS_PAGE_LIMIT,
            totalItems,
            page,
            totalPages,
            hasMore,
            hasPrev,
            prevStartAfter,
            nextStartAfter,
        };
    }
);

export const getAdminAlbumsList = async (): Promise<GalleryAlbumType[]> => {
    const albumSnapshot = await db.collection("gallery-albums").orderBy("name", "asc").get();

    const albums: GalleryAlbumType[] = albumSnapshot.docs.map(doc => {
        const album = doc.data() as GalleryAlbumType;
        album.timestamp = timestampToDate(album.timestamp);

        return album;
    });

    albums.push(await getUnknownAlbum());

    return albums;
};

export const getAlbumById = cache(
    async (albumId: string): Promise<GalleryAlbumType | null> => {

        if (albumId === "unknown-album") {
            return await getUnknownAlbum();
        }

        const docRef = await db
            .collection("gallery-albums")
            .doc(albumId)
            .get();

        if (!docRef.exists) {
            return null;
        }

        const album = docRef.data() as GalleryAlbumType;

        return {
            ...album,
            timestamp: timestampToDate(album.timestamp)
        };
    }
);

export const getAlbumBySlug = cache(
    async (albumSlug: string): Promise<GalleryAlbumType | null> => {

        if (albumSlug === "unknown-album") {
            return await getUnknownAlbum();
        }

        const albumSnapshot = await db
            .collection("gallery-albums")
            .where("slug", "==", albumSlug)
            .limit(1)
            .get();

        if (albumSnapshot.empty) return null;

        const albumDoc = albumSnapshot.docs[0];
        const albumData = albumDoc.data() as GalleryAlbumType;

        return {
            ...albumData,
            timestamp: timestampToDate(albumData.timestamp)
        };
    }
);

interface GallerySnapshotType {
    albums: GalleryAlbumType[];
    images: GalleryImageType[];
}

export const getGallerySnapshot = cache(
    async (): Promise<GallerySnapshotType> => {

        const [albumSnapshot, imageSnapshot] = await Promise.all([
            db.collection("gallery-albums").get(),
            db.collection("gallery-images").get(),
        ]);

        const albums: GalleryAlbumType[] = albumSnapshot.docs.map((doc) => {
            const data = doc.data() as Omit<GalleryAlbumType, "images">;
            data.timestamp = timestampToDate(data.timestamp);

            return data;
        });

        const images: GalleryImageType[] = imageSnapshot.docs.map(normalizeImageData);

        albums.push(await getUnknownAlbum());

        return {
            albums,
            images,
        };
    }
);

export const getImageBySlug = cache(
    async (
        imageSlug: string
    ): Promise<GalleryImageType | null> => {
        const imageSnapshot = await db
            .collection("gallery-images")
            .where("slug", "==", imageSlug)
            .limit(1)
            .get();

        if (imageSnapshot.empty) return null;

        const doc = imageSnapshot.docs[0];

        return normalizeImageData(doc);
    }
);

export const getImageById = cache(
    async (imageId: string): Promise<GalleryImageType | null> => {
        const docSnapshot = await db.collection("gallery-images").doc(imageId).get();

        if (!docSnapshot.exists) return null;

        return normalizeImageData(docSnapshot);
    }
);

export const getLatestGalleryImages = cache(
    async (): Promise<(GalleryImageType & { albumSlug: string })[]> => {
        const latestImagesSnapshot = await db
            .collection("gallery-images")
            .orderBy("timestamp", "desc")
            .limit(IMAGES_PAGE_LIMIT)
            .get();

        const latestImages = latestImagesSnapshot.docs.map(normalizeImageData);

        const albumIds = [
            ...new Set(
                latestImages
                    .map((img) => img.albumId)
                    .filter((id): id is string => Boolean(id))
            ),
        ];

        const refs = albumIds.map((id) => db.collection("gallery-albums").doc(id));
        const albumSnapshots = await db.getAll(...refs);

        const albumSlugMap = new Map<string, string>();

        albumSnapshots.forEach((doc) => {
            if (doc.exists) {
                const data = doc.data();
                albumSlugMap.set(doc.id, data?.slug || "unknown-album");
            }
        });

        return latestImages.map((img) => ({
            ...img,
            albumSlug: img.albumId
                ? albumSlugMap.get(img.albumId) || "unknown-album"
                : "unknown-album",
        }));
    }
);

export const getImageFromAlbum = cache(
    async (
        albumId: string | null,
        startAfter?: string
    ): Promise<GetImagesResponse> => {
        const normalizedAlbumId =
            albumId === null || albumId === "unknown-album" ? null : albumId;

        const baseQuery = db
            .collection("gallery-images")
            .where("albumId", "==", normalizedAlbumId)
            .orderBy("timestamp", "desc")
            .orderBy(FieldPath.documentId(), "desc");

        const [totalSnapshot, page, pagedSnapshot] = await Promise.all([
            baseQuery.count().get(),
            getCursorPageNumber(baseQuery, startAfter, IMAGES_PAGE_LIMIT),
            applyStartAfterCursor(baseQuery, startAfter)
                .limit(IMAGES_PAGE_LIMIT + 1)
                .get(),
        ]);

        const hasMore = pagedSnapshot.docs.length > IMAGES_PAGE_LIMIT;
        const docs = hasMore
            ? pagedSnapshot.docs.slice(0, IMAGES_PAGE_LIMIT)
            : pagedSnapshot.docs;

        const images: GalleryImageType[] = docs.map(normalizeImageData);

        const totalItems = totalSnapshot.data().count;
        const totalPages = Math.max(1, Math.ceil(totalItems / IMAGES_PAGE_LIMIT));

        const nextStartAfter =
            hasMore && docs.length > 0
                ? encodeCursor(docs[docs.length - 1])
                : undefined;

        const hasPrev = !!startAfter;
        const prevStartAfter = hasPrev && pagedSnapshot.docs.length > 0
            ? await getPreviousCursor(baseQuery, pagedSnapshot.docs[0], IMAGES_PAGE_LIMIT)
            : undefined;

        return {
            images,
            hasMore,
            totalItems,
            limit: IMAGES_PAGE_LIMIT,
            page,
            totalPages,
            hasPrev,
            prevStartAfter,
            nextStartAfter,
        };
    }
);

export const getAlbumPreviewImages = cache(
    async (previewIds: string[]): Promise<Map<string, GalleryImageType>> => {

        if (!previewIds || !previewIds.length) return new Map();

        const refs = previewIds.map((id) =>
            db.collection("gallery-images").doc(id)
        );

        const snapshots = await db.getAll(...refs);

        const imageMap = new Map<string, GalleryImageType>();

        snapshots.forEach((doc) => {
            if (doc.exists) {
                imageMap.set(doc.id, normalizeImageData(doc));
            }
        });

        return imageMap;
    }
);
