// netlify/functions/log.js
const fs = require("fs");

exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const logEntry = JSON.parse(event.body);
  const logString = `<span class="math-inline">\{logEntry\.timestamp\},</span>{logEntry.videoId},<span class="math-inline">\{logEntry\.videoTitle\},</span>{logEntry.eventType},${logEntry.duration}\n`;

  try {
    fs.appendFileSync("video_log.csv", logString);
    return { statusCode: 200, body: "Log saved" };
  } catch (err) {
    console.error("Error writing to log file:", err);
    return { statusCode: 500, body: "Error writing to log file" };
  }
};
