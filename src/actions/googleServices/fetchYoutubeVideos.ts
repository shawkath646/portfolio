"use server";
import { cache } from "react";

const youtubeApiUrl = "https://www.googleapis.com/youtube/v3";
const YT_CHANNEL_ID = process.env.YT_CHANNEL_ID;
if (!YT_CHANNEL_ID) throw Error("Error: YT_CHANNEL_ID not found!");

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
if (!GOOGLE_API_KEY) throw Error("Error: GOOGLE_API_KEY not found!");

const fetchYouTubeVideos = cache(async () => {
    try {
        const channelRes = await fetch(
            `${youtubeApiUrl}/channels?part=contentDetails,snippet&id=${YT_CHANNEL_ID}&key=${GOOGLE_API_KEY}`
        );
        const channelData = await channelRes.json();

        const channel = {
            title: channelData.items[0]?.snippet?.title || "Unknown Channel",
            icon: channelData.items[0]?.snippet?.thumbnails?.default?.url || "",
            url: `https://www.youtube.com/channel/${YT_CHANNEL_ID}`,
        };

        const uploadsPlaylistId =
            channelData.items[0]?.contentDetails?.relatedPlaylists?.uploads;

        if (!uploadsPlaylistId) {
            throw new Error("Upload playlist not found.");
        }

        const videosRes = await fetch(
            `${youtubeApiUrl}/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=10&key=${GOOGLE_API_KEY}`
        );
        const videosData = await videosRes.json();

        const videos = videosData.items.map((item: any) => ({
            title: item.snippet.title,
            videoId: item.snippet.resourceId.videoId,
            thumbnail: item.snippet.thumbnails.medium.url,
            publishedAt: item.snippet.publishedAt,
            description: item.snippet.description,
        }));

        return { channel, videos };
    } catch (error) {
        console.error("Error fetching YouTube videos:", error);
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