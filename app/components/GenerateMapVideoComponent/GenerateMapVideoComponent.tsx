"use client";
import React, { useState } from "react";

interface GenerateVideoButtonProps {
  selectedCountry: string;
  fillColor: string;
  strokeColor: string;
  globalColor: string;
  duration?: number;
}

const GenerateMapVideoComponent: React.FC<GenerateVideoButtonProps> = ({
  selectedCountry,
  fillColor,
  strokeColor,
  globalColor,
  duration = 10,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  const handleGenerateVideo = async () => {
    if (!selectedCountry) {
      alert("Please select a country before generating the video.");
      return;
    }

    setIsLoading(true);
    setProgress(0);
    setVideoUrl(null);

    // Simulate progress bar (you can remove this if your backend supports progress)
    const simulateProgress = () => {
      let count = 0;
      const interval = setInterval(() => {
        count += 10;
        setProgress(count);
        if (count >= 90) clearInterval(interval);
      }, 500);
    };
    simulateProgress();

    try {
      const response = await fetch("https://devstream-backend.onrender.com/api/v1/motion-videos/maps/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          duration,
          fillColor,
          strokeColor,
          globalColor,
          country: selectedCountry,
        }),
      });

      if (!response.ok) throw new Error("Failed to generate video");

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setVideoUrl(url);
      setProgress(100);
    } catch (error) {
      console.error("Error generating video:", error);
      alert("Something went wrong while generating the video.");
      setProgress(0);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    window.location.reload();
  };

  return (
    <div className="mt-6 space-y-4 p-4">
      <button
        onClick={handleGenerateVideo}
        disabled={isLoading}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50 cursor-pointer"
      >
        {isLoading ? "Generating..." : "Generate Video"}
      </button>

      {isLoading && (
        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
          <div
            className="bg-blue-500 h-4 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {videoUrl && (
        <div className="flex gap-4 items-center">
          <a
            href={videoUrl}
            download={`map-video-${selectedCountry}.mp4`}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            Download Video
          </a>
          <button
            onClick={handleReset}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
          >
            Reset
          </button>
        </div>
      )}
    </div>
  );
};

export default GenerateMapVideoComponent;
