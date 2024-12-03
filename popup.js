// Importing necessary modules
const { OpenAI } = require("openai");
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const getCaptions = require('./getTranscript');

// OpenAI API initialization
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

document.getElementById("get-summary-btn").addEventListener("click", async () => {
  const videoUrl = document.getElementById("video-url").value; // Get the YouTube video URL from the input
  const videoId = extractVideoIdFromUrl(videoUrl); // Function to extract video ID from the URL

  // Check if the videoId is valid
  if (!videoId) {
    document.getElementById("summary").innerText = "Invalid YouTube URL.";
    return;
  }

  try {
    // Step 1: Fetch the transcript using your server
    const transcriptResponse = await fetch("http://localhost:3000/get-captions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ videoId }),
    });

    if (!transcriptResponse.ok) {
      throw new Error("Failed to fetch transcript from server.");
    }

    const transcriptData = await transcriptResponse.json();
    const transcript = transcriptData.captions;

    // Step 2: Send transcript to server for OpenAI summary
    const summaryResponse = await fetch("http://localhost:3000/summarize", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ transcript }),
    });

    if (!summaryResponse.ok) {
      throw new Error("Failed to generate summary from server.");
    }

    const summaryData = await summaryResponse.json();
    const summaryText = summaryData.summary;

    // Display the summary in the popup
    document.getElementById("summary").innerText = summaryText;
  } catch (error) {
    console.error("Error:", error);
    document.getElementById("summary").innerText = "Error generating summary.";
  }
});

// Utility function to extract the YouTube video ID from the URL
function extractVideoIdFromUrl(url) {
  const regex = /(?:https?:\/\/(?:www\.)?youtube\.com\/(?:[^\/]+\/\S+\/|(?:v|e(?:mbed)?)\/?([A-Za-z0-9_-]+)|(?:.*[?&]v=)([A-Za-z0-9_-]+)))/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

