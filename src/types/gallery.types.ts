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
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    hasMore: boolean;
}

export interface GetImagesResponse {
    images: GalleryImageType[];
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    hasMore: boolean;
}

export interface GalleryImageType {
    id: string;
    title: string;
    description: string;
    slug: string;
    alt: string;
    src: string;
    height: number;
    width: number;
    location: string;
    timestamp: Date;
    createdAt: Date;
    albumId: string | null;
}
