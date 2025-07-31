import React, { useState } from "react";

interface GenerateVideoProps {
  text: string;
  event_name: string | null;
  duration: number;
  font_size: string;
  font_weight: string;
  font_style: string;
  text_color: string;
  console_color: string;
}

const GenerateVideoComponent: React.FC<GenerateVideoProps> = ({
  text,
  event_name,
  duration,
  font_size,
  font_weight,
  font_style,
  text_color,
  console_color,
}) => {
  const [progress, setProgress] = useState(0);
  const [videoUrl, setVideoUrl] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const simulateProgress = () => {
    let value = 0;
    const interval = setInterval(() => {
      value += Math.random() * 10;
      if (value >= 95) {
        clearInterval(interval);
      }
      setProgress(Math.min(value, 95));
    }, 200);
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setProgress(0);
    setVideoUrl("");
    simulateProgress();

    try {
      const response = await fetch("https://devstream-backend-1.onrender.com/api/v1/motion-videos/text/", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          event_name,
          duration,
          font_size,
          font_weight,
          font_style,
          text_color,
          console_color,
        }),
      });

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setProgress(100);
      setVideoUrl(url);
    } catch (err) {
      alert("Failed to generate video.");
      console.error(err);
    } finally {
      setTimeout(() => setIsGenerating(false), 1000);
    }
  };

  const handleReset = () => {
    setVideoUrl("");
    setProgress(0);
    setIsGenerating(false);
  };

  return (
    <div className="flex flex-col items-center mt-4 w-[20rem] space-y-3">
      {!videoUrl && (
        <div
          className="w-full h-10 bg-gray-200 rounded-full overflow-hidden shadow relative"
          onClick={!isGenerating ? handleGenerate : undefined}
          style={{ cursor: isGenerating ? "not-allowed" : "pointer" }}
        >
          {/* Animated progress bar */}
          <div
            className="h-full bg-green-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>

          {/* Centered Text */}
          <div className="absolute inset-0 flex items-center justify-center font-semibold text-white pointer-events-none">
            {isGenerating ? `${Math.floor(progress)}%` : "Generate Video"}
          </div>
        </div>
      )}

      {videoUrl && (
        <>
          <a
            href={videoUrl}
            download="text-animation.mp4"
            className="w-full h-10 bg-green-600 text-white rounded-full text-center flex items-center justify-center font-semibold shadow hover:bg-green-700 transition-all"
          >
            Download Video
          </a>

          <button
            onClick={handleReset}
            className="w-full h-10 bg-gray-400 text-white rounded-full text-center flex items-center justify-center font-semibold shadow hover:bg-gray-500 transition-all"
          >
            Reset
          </button>
        </>
      )}
    </div>
  );
};

export default GenerateVideoComponent;
