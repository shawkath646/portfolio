export interface GalleryAlbumType {
    id: string;
    name: string;
    slug: string;
    timestamp: Date;
    imageCount: number;
    previewImages: string[];
}

export interface GetAlbumsResponse {
    albums: GalleryAlbumType[];
    limit: number;
    totalItems: number;
    page: number;
    totalPages: number;
    hasMore: boolean;
    hasPrev: boolean;
    prevStartAfter?: string;
    nextStartAfter?: string;
}

export interface GetImagesResponse {
    images: GalleryImageType[];
    limit: number;
    totalItems: number;
    page: number;
    totalPages: number;
    hasMore: boolean;
    hasPrev: boolean;
    prevStartAfter?: string;
    nextStartAfter?: string;
}

export interface GalleryImageItemType {
    id: string;
    src: string;
    height: number;
    width: number;
    timestamp: Date;
    size: number;
}

export interface GalleryImageType {
    id: string;
    title: string;
    description: string;
    slug: string;
    alt: string;
    images: GalleryImageItemType[];
    location: string;
    timestamp: Date;
    albumId: string | null;
}
