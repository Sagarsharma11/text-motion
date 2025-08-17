"use client";
import { recordDivAsCanvas } from "@/utils/record";
import { useState, useRef } from "react";
import { MdZoomOutMap } from "react-icons/md";

export default function Home() {
  const [bgColor, setBgColor] = useState("#333333");
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const consoleRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      consoleRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const randomColor = () =>
    `#${Math.floor(Math.random() * 16777215).toString(16)}`;

  const startRandomLoop = () => {
    stopLoop();
    intervalRef.current = setInterval(() => {
      setBgColor(randomColor());
    }, 500);
  };

  const startRGBLoop = () => {
    stopLoop();
    let i = 0;
    intervalRef.current = setInterval(() => {
      const colors = ["#ff0000", "#00ff00", "#0000ff"];
      setBgColor(colors[i % colors.length]);
      i++;
    }, 700);
  };

  const stopLoop = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

// Record 10s of the console box
const handleRecord = async () => {
  if (consoleRef.current) {
    setIsDownloading(true);
    setDownloaded(false);

    // Start recording
    await recordDivAsCanvas(consoleRef.current, 10000, "flash-demo.webm");

    // Keep spinner for 10s
    setTimeout(() => {
      setIsDownloading(false);
      setDownloaded(true);

      // Reset after 5s
      setTimeout(() => setDownloaded(false), 5000);
    }, 10000);
  }
};


  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-6">
      {/* Console */}
      <div
        ref={consoleRef}
        style={{ backgroundColor: bgColor }}
        className="w-[500px] h-[300px] shadow-lg p-4 overflow-y-auto 
             transition-colors duration-700 ease-in-out"
      ></div>

      {/* Buttons */}
      <div className="w-[500px] flex gap-4 mt-4 items-center justify-center">
        <button
          onClick={startRandomLoop}
          className="px-4 py-2 bg-purple-600 text-white rounded-xl shadow hover:bg-purple-700 cursor-pointer"
        >
          Random Loop
        </button>
        <button
          onClick={startRGBLoop}
          className="px-4 py-2 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700 cursor-pointer"
        >
          RGB Loop
        </button>
        <button
          onClick={stopLoop}
          className="px-4 py-2 bg-gray-600 text-white rounded-xl shadow hover:bg-gray-700 cursor-pointer"
        >
          Stop
        </button>
      </div>

      {/* Controls */}
      <div className="w-[500px] flex gap-4 mt-6 items-center justify-between">
        {/* Background Color Picker */}
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={bgColor}
            onChange={(e) => setBgColor(e.target.value)}
            className="w-12 h-12 rounded cursor-pointer"
          />
          <label className="text-sm font-bold">Change the flash color</label>
        </div>

        {/* Fullscreen + Download */}
        <div className="flex items-center gap-3">
          <button onClick={toggleFullscreen} className="cursor-pointer">
            <MdZoomOutMap size={24} color="gray" />
          </button>

          <button
            onClick={handleRecord}
            disabled={isDownloading}
            className={`px-6 py-2 rounded-xl shadow text-white flex items-center gap-2 ${
              isDownloading
                ? "bg-green-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700 cursor-pointer"
            }`}
          >
            {isDownloading ? (
              <>
                <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>Downloading...</span>
              </>
            ) : downloaded ? (
              <>✅ Downloaded</>
            ) : (
              <>🎥 Download 10s</>
            )}
          </button>
        </div>
      </div>
    </main>
  );
}

