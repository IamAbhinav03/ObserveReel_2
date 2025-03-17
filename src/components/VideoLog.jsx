// src/components/VideoLog.jsx
import React from "react";

function VideoLog({ logs }) {
  return (
    <div>
      {logs.map((log, index) => (
        <div key={index} className="text-sm">
          {log.timestamp} - {log.videoTitle} ({log.videoId}) - {log.eventType} -
          Duration: {log.duration ? log.duration + "ms" : "N/A"}
        </div>
      ))}
    </div>
  );
}

export default VideoLog;
