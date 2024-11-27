class MusicParser {
    static parseUrl(url) {
        try {
            if (!url) {
                return { is_valid: false, error: "URL is required" };
            }

            // console.log('Parsing URL:', url);
            const urlObj = new URL(url);
            // console.log('URL Object:', urlObj);

            if (urlObj.hostname.includes("youtube.com") || urlObj.hostname.includes("youtu.be")) {
                const videoId = urlObj.searchParams.get("v") || urlObj.pathname.slice(1);

                if (!videoId) {
                    return { is_valid: false, error: "Invalid YouTube URL format" };
                }

                return {
                    platform: "youtube",
                    id: videoId,
                    url: `https://www.youtube.com/embed/${videoId}`,
                    is_valid: true
                };
            }

            return { is_valid: false, error: "Unsupported platform" };
        } catch (error) {
            // console.error('URL Parsing Error:', error);
            return { is_valid: false, error: "Invalid URL format" };
        }
    }
}

module.exports = MusicParser;