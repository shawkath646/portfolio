"use server";
import { cache } from "react";
import { db } from "@/lib/firebase";
import { GalleryAlbumType, GalleryImageType, GetAlbumsResponse, GetImagesResponse } from "@/types/gallery.types";
import { timestampToDate } from "@/utils/dateTime";

type GetAllAlbumsParams = {
    page?: number;
    limit?: number;
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
    async ({
        page = 1,
        limit = 15
    }: GetAllAlbumsParams = {}): Promise<GetAlbumsResponse> => {

        const pageNumber = Math.max(1, page);
        const offset = (pageNumber - 1) * limit;

        const baseQuery = db
            .collection("gallery-albums")
            .orderBy("timestamp", "desc");

        const totalSnapshot = await baseQuery.count().get();
        const totalItems = totalSnapshot.data().count;
        const totalPages = Math.max(Math.ceil(totalItems / limit), 1);

        const snapshot = await baseQuery
            .offset(offset)
            .limit(limit + 1)
            .get();

        const docs = snapshot.docs;
        const hasMore = docs.length > limit;

        if (hasMore) {
            docs.pop();
        }

        const albums = docs.map((doc) => {
            const album = doc.data() as GalleryAlbumType;
            album.timestamp = timestampToDate(album.timestamp);
            return album;
        });



        if (!hasMore) {
            const unknownAlbum = await getUnknownAlbum();

            if (unknownAlbum.imageCount > 0) {
                albums.push();
            }
        }

        return {
            albums,
            page: pageNumber,
            limit,
            totalItems,
            totalPages,
            hasMore
        };
    }
);

export const getAdminAlbumsList = async (): Promise<GalleryAlbumType[]> => {
    const albumSnapshot = await db.collection("gallery-albums").orderBy("timestamp", "desc").get();

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
            const data = doc.data() as GalleryAlbumType;
            data.timestamp = timestampToDate(data.timestamp);

            return data;
        });

        const images: GalleryImageType[] = imageSnapshot.docs.map((doc) => {
            const data = doc.data() as GalleryImageType;
            data.timestamp = timestampToDate(data.timestamp);
            data.createdAt = timestampToDate(data.createdAt);

            return data;
        });

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

        const imageDoc = imageSnapshot.docs[0];
        const imageData = imageDoc.data() as GalleryImageType;
        imageData.timestamp = timestampToDate(imageData.timestamp);
        imageData.createdAt = timestampToDate(imageData.createdAt);

        return imageData;
    }
);

export const getImageById = cache(
    async (imageId: string): Promise<GalleryImageType | null> => {
        const docRef = await db.collection("gallery-images").doc(imageId).get();

        if (!docRef.exists) return null;
        const image = docRef.data() as GalleryImageType;
        image.timestamp = timestampToDate(image.timestamp);

        return image;
    }
)

export const getLatestGalleryImages = cache(
    async (): Promise<(GalleryImageType & { albumSlug: string })[]> => {
        const latestImagesSnapshot = await db
            .collection("gallery-images")
            .orderBy("timestamp", "desc")
            .limit(15)
            .get();

        const latestImages = latestImagesSnapshot.docs.map((doc) => {
            const data = doc.data() as GalleryImageType;

            return {
                ...data,
                timestamp: timestampToDate(data.timestamp),
                createdAt: timestampToDate(data.createdAt),
            };
        });

        const albumIds = [
            ...new Set(
                latestImages
                    .map((img) => img.albumId)
                    .filter((id): id is string => Boolean(id))
            ),
        ];

        const albumSnapshots = await Promise.all(
            albumIds.map((id) => db.collection("gallery-albums").doc(id).get())
        );

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

type GetImagesParams = {
    page?: number;
    limit?: number;
};

export const getImageFromAlbum = cache(
    async (
        albumId: string | null,
        { page = 1, limit = 20 }: GetImagesParams = {}
    ): Promise<GetImagesResponse> => {

        const pageNumber = Math.max(1, page);
        const offset = (pageNumber - 1) * limit;

        const normalizedAlbumId =
            albumId === null || albumId === "unknown-album"
                ? null
                : albumId;

        const baseQuery = db
            .collection("gallery-images")
            .where("albumId", "==", normalizedAlbumId);

        const countSnapshot = await baseQuery.count().get();
        const totalItems = countSnapshot.data().count;
        const totalPages = Math.max(Math.ceil(totalItems / limit), 1);

        const snapshot = await baseQuery
            .orderBy("timestamp", "desc")
            .offset(offset)
            .limit(limit + 1)
            .get();

        const hasMore = snapshot.docs.length > limit;
        const docs = hasMore ? snapshot.docs.slice(0, limit) : snapshot.docs;

        const images = docs.map((doc) => {
            const image = doc.data() as GalleryImageType;

            return {
                ...image,
                timestamp: timestampToDate(image.timestamp),
                createdAt: timestampToDate(image.createdAt)
            };
        });

        return {
            images,
            hasMore,
            totalItems,
            limit,
            page: pageNumber,
            totalPages
        };
    }
);

export const getAlbumPreviewImages = cache(
    async (previewIds: string[]): Promise<Map<string, GalleryImageType>> => {

        if (!previewIds.length) return new Map();

        const refs = previewIds.map((id) =>
            db.collection("gallery-images").doc(id)
        );

        const snapshots = await db.getAll(...refs);

        const imageMap = new Map<string, GalleryImageType>();

        snapshots.forEach((doc) => {
            if (!doc.exists) return;

            const data = doc.data() as GalleryImageType;
            data.timestamp = timestampToDate(data.timestamp);
            data.createdAt = timestampToDate(data.createdAt);


            imageMap.set(doc.id, data);
        });

        return imageMap;
    }
);
