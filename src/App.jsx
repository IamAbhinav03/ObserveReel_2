// src/App.jsx
import React, { useState, useRef, useEffect } from "react";
import VideoPlayer from "./components/VideoPlayer";
import videos from "./data/videos";
import { sendLogToServer } from "./utils/logUtils"; // Import server log sending function

function App() {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [showInstructions, setShowInstructions] = useState(false); // Show instructions after user ID is entered
  const [userId, setUserId] = useState(""); // State for user ID
  const [isUserIdSet, setIsUserIdSet] = useState(false); // State to check if user ID is set
  const videoRef = useRef(null);
  const startTimeRef = useRef(null);

  const handleSetUserId = () => {
    if (userId.trim()) {
      setIsUserIdSet(true);
      setShowInstructions(true);
    }
  };

  const handleVideoEnd = () => {
    logVideoEvent("Video Ended");
    nextVideo();
  };

  const nextVideo = () => {
    if (currentVideoIndex < videos.length - 1) {
      setCurrentVideoIndex(currentVideoIndex + 1);
      startTimeRef.current = new Date(); // Reset start time for the next video
      logVideoEvent("Video Skipped");
    }
  };

  const prevVideo = () => {
    if (currentVideoIndex > 0) {
      setCurrentVideoIndex(currentVideoIndex - 1);
      startTimeRef.current = new Date(); // Reset start time for the previous video
      logVideoEvent("Previous Video Viewed");
    }
  };

  const logVideoEvent = (eventType) => {
    const currentTime = new Date();
    let relativeTimestamp = null;

    if (startTimeRef.current) {
      relativeTimestamp = (currentTime - startTimeRef.current) / 1000; // Calculate relative time in seconds
    }

    const logEntry = {
      userId, // Include user ID in the log
      videoId: videos[currentVideoIndex].id,
      videoTitle: videos[currentVideoIndex].title,
      eventType,
      timestamp: relativeTimestamp ? relativeTimestamp : 0, // Relative timestamp in seconds
    };

    sendLogToServer(logEntry); // Send to server
  };

  useEffect(() => {
    startTimeRef.current = new Date(); // Set the start time for the current video
  }, [currentVideoIndex]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "ArrowUp") {
        prevVideo();
      } else if (event.key === "ArrowDown") {
        nextVideo();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentVideoIndex]);

  return (
    <div className="h-screen w-screen bg-black relative flex justify-center items-center">
      {!isUserIdSet && (
        <div className="absolute inset-0 bg-black bg-opacity-75 flex flex-col justify-center items-center text-white z-50">
          <h1 className="text-2xl font-bold mb-4">Enter Your User ID</h1>
          <input
            type="text"
            placeholder="User ID"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="mb-4 px-4 py-2 rounded text-white bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            className="bg-blue-500 px-4 py-2 rounded"
            onClick={handleSetUserId}
          >
            Submit
          </button>
        </div>
      )}
      {showInstructions && (
        <div className="absolute inset-0 bg-black bg-opacity-75 flex flex-col justify-center items-center text-white z-50">
          <h1 className="text-2xl font-bold mb-4">Welcome to Reel Clone</h1>
          <p>Use the following controls:</p>
          <ul className="list-disc list-inside mb-4">
            <li>Up/Down arrows to scroll through videos</li>
            <li>Play/Pause button to control playback</li>
            <li>Skip/Prev buttons to navigate</li>
          </ul>
          <button
            className="bg-blue-500 px-4 py-2 rounded"
            onClick={() => setShowInstructions(false)}
          >
            Got it!
          </button>
        </div>
      )}
      <div className="max-w-md w-full h-full relative overflow-hidden">
        <VideoPlayer
          video={videos[currentVideoIndex]}
          onEnd={handleVideoEnd}
          videoRef={videoRef}
          logVideoEvent={logVideoEvent}
        />
      </div>
    </div>
  );
}

export default App;
