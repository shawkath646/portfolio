"use server";
const youtubeApiUrl = "https://www.googleapis.com/youtube/v3";
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

const channelId = "UCdnO4SySjkJZ_K7YsnLnj6w";

if (!GOOGLE_API_KEY) {
    throw new Error("GOOGLE_API_KEY is not defined in environment variables");
}

const fetchYouTubeVideos = async () => {
    try {
        const channelRes = await fetch(
            `${youtubeApiUrl}/channels?part=contentDetails,snippet&id=${channelId}&key=${GOOGLE_API_KEY}`
        );
        const channelData = await channelRes.json();

        const channel = {
            title: channelData.items[0]?.snippet?.title || "Unknown Channel",
            icon: channelData.items[0]?.snippet?.thumbnails?.default?.url || "",
            url: `https://www.youtube.com/channel/${channelId}`,
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
};

export default fetchYouTubeVideos;