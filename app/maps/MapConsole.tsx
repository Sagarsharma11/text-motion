"use client";
import React from "react";
import { MdZoomOutMap } from "react-icons/md";
import Button from "../components/Button/Button";

// interface MapConsoleProps {
//     countries: string[];
//     selectedCountry: string;
//     onSelectCountry: (country: string) => void;
//     fillColor: string;
//     setFillColor: (color: string) => void;
//     strokeColor: string;
//     setStrokeColor: (color: string) => void;
//     globalStrokeColor: string
//     setGlobalStrokeColor: (color: string) => void;
//     setAnimationStart: any
//     animationStart: boolean
// }

const MapConsole = ({
    countries,
    selectedCountry,
    onSelectCountry,
    fillColor,
    setFillColor,
    strokeColor,
    setStrokeColor,
    globalStrokeColor,
    setGlobalStrokeColor,
    animationStart,
    setAnimationStart,
    enterFullscreen
}: any) => {

    // console.log("Countries == > ", countries);
    // console.log("selected country ", selectedCountry)

    return (
        <div className="bg-gray-200 p-4 border-b border-gray-300 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">🌍 Map Console</h3>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                {/* Country Dropdown */}
                <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700">Country:</label>
                    <select
                        value={selectedCountry}
                        onChange={(e) => onSelectCountry(e.target.value)}
                        className="px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                        <option value="">Select a country</option>
                        {
                            //@ts-ignore
                            countries.map((country) => (
                                <option key={country} value={country}>
                                    {country}
                                </option>
                            ))}
                    </select>
                </div>



                {/* Fill Color Picker */}
                <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700">Fill Color:</label>
                    <input
                        type="color"
                        value={fillColor}
                        onChange={(e) => setFillColor(e.target.value)}
                        className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
                    />
                </div>

                {/* Stroke Color Picker */}
                <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700">Stroke Color:</label>
                    <input
                        type="color"
                        value={strokeColor}
                        onChange={(e) => setStrokeColor(e.target.value)}
                        className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
                    />
                </div>

                {/* Stroke Color Picker */}
                <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700">Global Stroke Color:</label>
                    <input
                        type="color"
                        value={globalStrokeColor}
                        onChange={(e) => setGlobalStrokeColor(e.target.value)}
                        className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
                    />
                </div>

                {/* Stroke Color Picker */}
                <div className="flex items-center gap-2">
                    <Button onClick={() => setAnimationStart(!animationStart)} >
                        Start Animation Video
                    </Button>
                </div>


                <button
                    className="absolute top-2 right-2 cursor-pointer"
                    onClick={enterFullscreen}
                    aria-label="Fullscreen"
                >
                    <MdZoomOutMap size={24} color="gray" />
                </button>

            </div>
        </div>
    );
};

export default MapConsole;
