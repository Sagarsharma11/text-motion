"use client";

import Button from "@/app/components/Button/Button";
import LiftUpAnimation from "@/app/components/TextAnimations/LiftUpAnimation/LiftUpAnimation";
import Typewriter from "@/app/components/TextAnimations/TypeWriter/TypeWriter";
import { useRef, useState, useEffect } from "react";
import { MdZoomOutMap, MdDownload } from "react-icons/md";
import CustomDropdown from "@/app/components/CustomDropdown/CustomDropdown";
import BlurTextAnimation from "@/app/components/TextAnimations/BlurTextAnimation/BlurTextAnimation";
import BlurIn from "@/app/components/TextAnimations/BlurIn/BlurIn";
import ShatterTextAnimation from "@/app/components/TextAnimations/SvgFlyIn/ShatterTextAnimation";
import ZoomInAnimation from "@/app/components/TextAnimations/ZoomInAnimation/ZoomInAnimation";
import ScrambleTextAnimation from "@/app/components/TextAnimations/ScrambleTextAnimation/ScrambleTextAnimation";
import { recordDivAsVideo, recordScreenFor } from "@/utils/record";

const Console = () => {
  const [displayText, setDisplayText] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const fullscreenRef = useRef<HTMLDivElement>(null);

  const [animationType, setAnimationType] = useState<string | null>(null);
  const [consoleColor, setConsoleColor] = useState({
    foreground: "#ffffff",
    background: "#1EFF00",
  });

  const [fontStyle, setFontStyle] = useState({
    fontSize: "24px",
    fontWeight: "normal",
    fontStyle: "normal",
  });

  const [isDownloading, setIsDownloading] = useState(false);

  const enterFullscreen = async () => {
    if (fullscreenRef.current && fullscreenRef.current.requestFullscreen) {
      await fullscreenRef.current.requestFullscreen();
      setIsFullscreen(true);
    }
  };

  const exitFullscreen = async () => {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleChange = () => {
      if (!document.fullscreenElement) {
        setIsFullscreen(false);
      }
    };
    document.addEventListener("fullscreenchange", handleChange);
    return () => document.removeEventListener("fullscreenchange", handleChange);
  }, []);

  const handleClick = (ele: string) => setAnimationType(ele);
  const clearAnimation = () => setAnimationType(null);

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setConsoleColor((prev) => ({ ...prev, [name]: value }));
  };

  const fontSizes = Array.from({ length: 100 }, (_, i) => `${(i + 1) * 2}px`);
  const fontWeights = [
    "normal",
    "bold",
    "bolder",
    "lighter",
    "100",
    "200",
    "300",
    "400",
    "500",
    "600",
    "700",
    "800",
    "900",
  ];
  const fontStyles = ["normal", "italic", "oblique"];

  const handleFontSizeChange = (newFontSize: string) => {
    setFontStyle((prev) => ({ ...prev, fontSize: newFontSize }));
  };

  const handleFontWeightChange = (newFontWeight: string) => {
    setFontStyle((prev) => ({ ...prev, fontWeight: newFontWeight }));
  };

  const handleFontStyleChange = (newFontStyle: string) => {
    setFontStyle((prev) => ({ ...prev, fontStyle: newFontStyle }));
  };

  const [downloaded, setDownloaded] = useState(false);

  const handleRecord = async() => {
    // if (fullscreenRef.current) {
    //   recordDivAsVideo(fullscreenRef.current, 10000, "text-animation.webm");
    // }
      if (fullscreenRef.current) {
        setIsDownloading(true);
        setDownloaded(false);
    
        // Start recording
        await recordDivAsVideo(fullscreenRef.current, 10000, "text-animation.webm");
    
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
    <div className="p-10 flex flex-col items-center justify-start bg-gray-50 dark:bg-black text-gray-900 dark:text-white w-full min-h-screen">
      <div className="w-full max-w-7xl">
        <h1 className="text-3xl font-bold mb-6">Text Animation Video Generator</h1>

        <div className="flex flex-col lg:flex-row gap-6 w-full">
          {/* Text Area */}
          <div className="flex-1">
            <textarea
              className="w-full p-4 h-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 resize-none text-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Type your text here..."
              onChange={(e) => setDisplayText(e.target.value)}
            />
          </div>

          {/* Controls */}
          <div className="flex flex-col gap-6 lg:w-80">
            {/* Color Inputs */}
            <div className="flex justify-between gap-4">
              <div className="flex flex-col items-start">
                <label className="text-sm font-medium mb-1">Background:</label>
                <input
                  type="color"
                  name="background"
                  value={consoleColor.background}
                  onChange={handleColorChange}
                  className="w-full border bg-gray-950 h-10 p-0 cursor-pointer"
                />
              </div>
              <div className="flex flex-col items-start">
                <label className="text-sm font-medium mb-1">Foreground:</label>
                <input
                  type="color"
                  name="foreground"
                  value={consoleColor.foreground}
                  onChange={handleColorChange}
                  className="w-full border bg-gray-950 h-10 p-0 cursor-pointer"
                />
              </div>
            </div>

            {/* Font Controls */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Font Size:</label>
                <CustomDropdown
                  options={fontSizes}
                  value={fontStyle.fontSize}
                  onChange={handleFontSizeChange}
                  placeholder="Select font size"
                />
              </div>
              <div className="w-full">
                <label className="block text-sm font-medium mb-1">Font Weight:</label>
                <CustomDropdown
                  options={fontWeights}
                  value={fontStyle.fontWeight}
                  onChange={handleFontWeightChange}
                  placeholder="Select font weight"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Font Style:</label>
                <CustomDropdown
                  options={fontStyles}
                  value={fontStyle.fontStyle}
                  onChange={handleFontStyleChange}
                  placeholder="Select font style"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-start mt-8 gap-6 flex-wrap">
          <Button onClick={() => handleClick("Typing")}>Typing</Button>
          <Button onClick={() => handleClick("LiftUpAnimation")}>LiftUpAnimation</Button>
          <Button onClick={() => handleClick("BlurTextAnimation")}>BlurTextAnimation</Button>
          <Button onClick={() => handleClick("BlurIn")}>BlurIn</Button>
          <Button onClick={() => handleClick("ShatterTextAnimation")}>ShatterTextAnimation</Button>
          <Button onClick={() => handleClick("ZoomInAnimation")}>ZoomInAnimation</Button>
          <Button onClick={() => handleClick("ScrambleTextAnimation")}>ScrambleTextAnimation</Button>
          <Button onClick={clearAnimation}>Clear</Button>
        </div>

        {/* Animation Preview */}
        <div
          ref={fullscreenRef}
          className="mt-10 w-full p-6 min-h-[14rem] shadow-md font-mono text-xl flex justify-center items-center"
          style={{
            backgroundColor: consoleColor.background,
            color: consoleColor.foreground,
          }}
        >
          {/* {!isFullscreen && (
            <button
              className="absolute top-2 right-2 cursor-pointer"
              onClick={enterFullscreen}
              aria-label="Fullscreen"
            >
              <MdZoomOutMap size={24} color={consoleColor.foreground} />
            </button>
          )} */}

          {animationType === "Typing" ? (
            <Typewriter text={displayText} style={fontStyle} />
          ) : animationType === "LiftUpAnimation" ? (
            <LiftUpAnimation text={displayText} style={fontStyle} />
          ) : animationType === "BlurTextAnimation" ? (
            <BlurTextAnimation text={displayText} style={fontStyle} />
          ) : animationType === "BlurIn" ? (
            <BlurIn text={displayText} style={fontStyle} interval={3000} />
          ) : animationType === "ShatterTextAnimation" ? (
            <ShatterTextAnimation text={displayText} style={fontStyle} />
          ) : animationType === "ZoomInAnimation" ? (
            <ZoomInAnimation text={displayText} style={fontStyle} />
          ) : animationType === "ScrambleTextAnimation" ? (
            <ScrambleTextAnimation text={displayText} style={fontStyle} />
          ) : (
            <span style={fontStyle}>{displayText}</span>
          )}
        </div>

        {/* Download Button */}
        <div className="mt-6 flex justify-center">

          <button
            onClick={handleRecord}
            disabled={isDownloading}
            className={`px-6 py-2 rounded-xl shadow text-white flex items-center gap-2 ${isDownloading
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
    </div>
  );
};

export default Console;
