// server/server.js
const express = require("express");
const fs = require("fs");
const app = express();
const port = 3001; // Choose a port

app.use(express.json()); // Parse JSON request bodies

app.post("/api/log", (req, res) => {
  const logEntry = req.body;
  const logString = `${logEntry.timestamp},${logEntry.videoId},${logEntry.videoTitle},${logEntry.eventType},${logEntry.duration}\n`;

  fs.appendFile("video_log.csv", logString, (err) => {
    if (err) {
      console.error("Error writing to log file:", err);
      res.status(500).send("Error writing to log file");
    } else {
      res.sendStatus(200);
    }
  });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
