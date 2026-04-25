/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from "next/og";
import { getAlbumBySlug, getAlbumPreviewImages } from "@/actions/gallery/getGalleryData";
import { GalleryImageType } from "@/types/gallery.types";

export const alt = "Photography album preview";

export const size = {
    width: 1200,
    height: 630,
};

export const contentType = "image/png";

export default async function Image({ params }: PageProps<'/[lang]/about/gallery/[albumSlug]'>) {
    const { albumSlug } = await params;
    const album = await getAlbumBySlug(albumSlug);

    if (!album) {
        return new ImageResponse(
            (
                <div
                    style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        padding: 56,
                        color: "white",
                        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 45%, #312e81 100%)",
                        boxSizing: "border-box",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            fontSize: 28,
                            fontWeight: 600,
                            opacity: 0.9,
                        }}
                    >
                        SHAWKATH646 • Photography Gallery
                    </div>

                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 18,
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                fontSize: 72,
                                fontWeight: 800,
                                lineHeight: 1.05,
                                letterSpacing: -1.5,
                            }}
                        >
                            Album Not Found
                        </div>
                        <div
                            style={{
                                display: "flex",
                                fontSize: 30,
                                color: "rgba(255,255,255,0.82)",
                            }}
                        >
                            https://shawkath646.pro/about/gallery
                        </div>
                    </div>

                    <div
                        style={{
                            display: "flex",
                            fontSize: 24,
                            opacity: 0.72,
                        }}
                    >
                        Curated moments • Travel • Creative photography
                    </div>
                </div>
            ),
            size
        );
    }

    const previewImageIds = album.previewImages ?? [];
    const previewImagesMap =
        previewImageIds.length > 0
            ? await getAlbumPreviewImages(previewImageIds)
            : new Map<string, GalleryImageType>();

    const previewImages = previewImageIds
        .map((imageId) => previewImagesMap.get(imageId))
        .filter((image): image is GalleryImageType => Boolean(image))
        .slice(0, 4);

    const coverImage = previewImages[0]
        ? previewImages[0].images[0]?.src ?? null
        : null;

    return new ImageResponse(
        (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    background: "linear-gradient(135deg, #0f172a 0%, #1e293b 45%, #312e81 100%)",
                    color: "white",
                    padding: 42,
                    boxSizing: "border-box",
                    position: "relative",
                    overflow: "hidden",
                }}
            >
                <div
                    style={{
                        position: "absolute",
                        right: -120,
                        top: -120,
                        width: 420,
                        height: 420,
                        borderRadius: 999,
                        background: "radial-gradient(circle, rgba(96,165,250,0.25), rgba(0,0,0,0))",
                        display: "flex",
                    }}
                />

                <div
                    style={{
                        position: "absolute",
                        left: -80,
                        bottom: -160,
                        width: 520,
                        height: 520,
                        borderRadius: 999,
                        background: "radial-gradient(circle, rgba(56,189,248,0.22), rgba(0,0,0,0))",
                        display: "flex",
                    }}
                />

                <div
                    style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: 28,
                        border: "1px solid rgba(255,255,255,0.16)",
                        background: "rgba(15, 23, 42, 0.62)",
                        padding: 36,
                        boxSizing: "border-box",
                        display: "flex",
                        gap: 24,
                    }}
                >
                    <div
                        style={{
                            width: "58%",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            gap: 22,
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                alignSelf: "flex-start",
                                borderRadius: 999,
                                border: "1px solid rgba(255,255,255,0.2)",
                                background: "rgba(15,23,42,0.4)",
                                padding: "8px 16px",
                                fontSize: 18,
                                fontWeight: 600,
                                letterSpacing: 0.4,
                                color: "rgba(255,255,255,0.9)",
                            }}
                        >
                            PHOTO ALBUM
                        </div>

                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 14,
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    fontSize: 68,
                                    fontWeight: 800,
                                    lineHeight: 1.05,
                                    letterSpacing: -1.6,
                                    maxWidth: "100%",
                                }}
                            >
                                {album.name}
                            </div>

                            <div
                                style={{
                                    display: "flex",
                                    fontSize: 28,
                                    fontWeight: 500,
                                    color: "rgba(255,255,255,0.86)",
                                }}
                            >
                                {album.imageCount} {album.imageCount === 1 ? "Photo" : "Photos"}
                            </div>
                        </div>

                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 6,
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    fontSize: 22,
                                    color: "rgba(255,255,255,0.76)",
                                }}
                            >
                                Portfolio by Shawkat Hossain Maruf
                            </div>
                            <div
                                style={{
                                    display: "flex",
                                    fontSize: 30,
                                    fontWeight: 700,
                                    color: "#bfdbfe",
                                }}
                            >
                                https://shawkath646.pro
                            </div>
                        </div>
                    </div>

                    <div
                        style={{
                            width: "42%",
                            display: "flex",
                            flexDirection: "column",
                            gap: 12,
                        }}
                    >
                        {coverImage ? (
                            <div
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    borderRadius: 20,
                                    overflow: "hidden",
                                    border: "1px solid rgba(255,255,255,0.2)",
                                    display: "flex",
                                    position: "relative",
                                }}
                            >
                                <img
                                    src={coverImage}
                                    width={460}
                                    height={460}
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                    }}
                                />

                                {previewImages.length > 1 && (
                                    <div
                                        style={{
                                            position: "absolute",
                                            right: 14,
                                            bottom: 14,
                                            borderRadius: 12,
                                            background: "rgba(2, 6, 23, 0.72)",
                                            border: "1px solid rgba(255,255,255,0.24)",
                                            color: "white",
                                            fontSize: 18,
                                            fontWeight: 700,
                                            padding: "8px 12px",
                                            display: "flex",
                                        }}
                                    >
                                        +{previewImages.length - 1} more
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    borderRadius: 20,
                                    border: "1px solid rgba(255,255,255,0.18)",
                                    background: "linear-gradient(135deg, rgba(59,130,246,0.26), rgba(99,102,241,0.28))",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: 30,
                                    fontWeight: 700,
                                    color: "rgba(255,255,255,0.9)",
                                    textAlign: "center",
                                }}
                            >
                                Album Preview
                            </div>
                        )}
                    </div>
                </div>
            </div>
        ),
        size
    );
}
