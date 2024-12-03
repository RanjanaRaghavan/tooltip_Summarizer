const axios = require("axios");

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

async function getCaptions(videoId) {
  try {
    // Fetch the available captions for the video
    const captionsUrl = `https://www.googleapis.com/youtube/v3/captions?videoId=${videoId}&key=${YOUTUBE_API_KEY}`;
    const captionsResponse = await axios.get(captionsUrl);

    const captions = captionsResponse.data.items;

    if (captions.length > 0) {
      // Choose the first available caption track (can be customized for language, etc.)
      const captionId = captions[0].id;

      // Fetch the actual caption text (use format=json to get as JSON if available)
      const captionTextUrl = `https://www.googleapis.com/youtube/v3/captions/${captionId}?key=${YOUTUBE_API_KEY}`;
      const captionTextResponse = await axios.get(captionTextUrl, {
        headers: { Accept: "application/json" },
      });

      return captionTextResponse.data;
    } else {
      throw new Error("No captions available for this video.");
    }
  } catch (error) {
    console.error("Error fetching captions:", error);
    throw new Error("Error fetching captions.");
  }
}

module.exports = getCaptions;
