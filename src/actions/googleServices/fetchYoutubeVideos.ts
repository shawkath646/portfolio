"use server";
import { cache } from "react";
import { getEnv } from "@/utils/getEnv";

const youtubeApiUrl = "https://www.googleapis.com/youtube/v3";

interface YouTubeSnippet {
    title: string;
    description: string;
    publishedAt: string;
    thumbnails: {
        default?: { url: string };
        medium?: { url: string };
        high?: { url: string };
    };
    resourceId?: {
        videoId: string;
    };
}

interface YouTubeChannelItem {
    id: string;
    snippet: YouTubeSnippet;
    contentDetails: {
        relatedPlaylists: {
            uploads: string;
        };
    };
}

interface YouTubePlaylistItem {
    id: string;
    snippet: YouTubeSnippet;
}

interface YouTubeApiResponse<T> {
    items: T[];
}

const fetchYouTubeVideos = cache(async () => {
    try {
        const apiKey = getEnv("GOOGLE_API_KEY");
        const channelId = getEnv("YT_CHANNEL_ID");

        const channelRes = await fetch(
            `${youtubeApiUrl}/channels?part=contentDetails,snippet&id=${channelId}&key=${apiKey}`,
            { next: { revalidate: 3600 } }
        );

        if (!channelRes.ok) throw new Error(`Channel fetch failed: ${channelRes.statusText}`);

        const channelData = (await channelRes.json()) as YouTubeApiResponse<YouTubeChannelItem>;

        const channelItem = channelData.items[0];
        if (!channelItem) throw new Error("Channel not found.");

        const channel = {
            title: channelItem.snippet.title || "Unknown Channel",
            icon: channelItem.snippet.thumbnails.default?.url || "",
            url: `https://www.youtube.com/channel/${channelId}`,
        };

        const uploadsPlaylistId = channelItem.contentDetails?.relatedPlaylists?.uploads;

        if (!uploadsPlaylistId) {
            throw new Error("Upload playlist not found.");
        }

        const videosRes = await fetch(
            `${youtubeApiUrl}/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=10&key=${apiKey}`,
            { next: { revalidate: 3600 } }
        );

        if (!videosRes.ok) throw new Error(`Videos fetch failed: ${videosRes.statusText}`);

        const videosData = (await videosRes.json()) as YouTubeApiResponse<YouTubePlaylistItem>;

        const videos = videosData.items.map((item) => ({
            title: item.snippet.title,
            videoId: item.snippet.resourceId?.videoId ?? "",
            thumbnail:
                item.snippet.thumbnails.medium?.url ||
                item.snippet.thumbnails.default?.url ||
                "",
            publishedAt: item.snippet.publishedAt,
            description: item.snippet.description,
        }));

        return { channel, videos };

    } catch (error) {
        console.error("Error fetching YouTube data:", error);

        return {
            channel: {
                title: "Unavailable",
                icon: "",
                url: "#",
            },
            videos: [],
        };
    }
});

export default fetchYouTubeVideos;