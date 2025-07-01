const youtubeApiUrl = "https://www.googleapis.com/youtube/v3";
const youtubeApiKey = process.env.YOUTUBE_API_KEY;

const channelId = "UCdnO4SySjkJZ_K7YsnLnj6w";

const fetchYouTubeVideos = async () => {
    try {
        const channelRes = await fetch(
            `${youtubeApiUrl}/channels?part=contentDetails,snippet&id=${channelId}&key=${youtubeApiKey}`
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
            `${youtubeApiUrl}/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=10&key=${youtubeApiKey}`
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

export { fetchYouTubeVideos };