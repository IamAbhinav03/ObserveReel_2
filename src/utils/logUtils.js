// src/utils/logUtils.js
export const sendLogToServer = async (logEntry) => {
  try {
    const response = await fetch("/.netlify/functions/log", {
      // Replace with your server endpoint
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(logEntry),
    });

    if (!response.ok) {
      console.error("Failed to send log:", response.statusText);
    }
  } catch (error) {
    console.error("Error sending log:", error);
  }
};
