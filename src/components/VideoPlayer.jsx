// src/components/VideoPlayer.jsx
import React, { useState, useRef, useEffect } from "react";

function VideoPlayer({ video, onEnd, videoRef, logVideoEvent }) {
  const [isPlaying, setIsPlaying] = useState(true);

  const togglePlay = () => {
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
      logVideoEvent("Video Resumed");
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
      logVideoEvent("Video Paused");
    }
  };

  const handleRewind = () => {
    if (videoRef.current.currentTime > 5) {
      videoRef.current.currentTime -= 5;
      logVideoEvent("Video Rewinded");
    } else {
      videoRef.current.currentTime = 0;
      logVideoEvent("Video Rewinded");
    }
  };

  const handleForward = () => {
    if (videoRef.current.currentTime < videoRef.current.duration - 5) {
      videoRef.current.currentTime += 5;
      logVideoEvent("Video Forwarded");
    } else {
      videoRef.current.currentTime = videoRef.current.duration;
      logVideoEvent("Video Forwarded");
    }
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play();
    }
  }, [video]);

  return (
    <div className="relative h-full w-full flex items-center justify-center">
      <video
        ref={videoRef}
        src={video.url}
        className="object-cover h-full w-full"
        onEnded={onEnd}
      ></video>
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex space-x-4">
        <button onClick={handleRewind} className="bg-gray-800 p-2 rounded-full">
          {"<<"}
        </button>
        <button onClick={togglePlay} className="bg-gray-800 p-2 rounded-full">
          {isPlaying ? "Pause" : "Play"}
        </button>
        <button
          onClick={handleForward}
          className="bg-gray-800 p-2 rounded-full"
        >
          {">>"}
        </button>
      </div>
    </div>
  );
}

export default VideoPlayer;

// src/components/VideoLog.jsx (no changes needed)
// src/data/videos.js (no changes needed)
