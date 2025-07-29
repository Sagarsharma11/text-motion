"use client";
import React, { useEffect, useState, useRef } from "react";
import MapConsole from "./MapConsole";
import Map2 from "../components/MapComponents/Map2";


const Page = () => {
  // const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [countryList, setCountryList] = useState<string[]>([]);
  const [animationStart, setAnimationStart] = useState(false);

  const [fillColor, setFillColor] = useState("#00e5ff");
  const [strokeColor, setStrokeColor] = useState("#ffffff");
  const [globalStrokeColor, setGlobalStrokeColor] = useState("#00e5ff");

  const [animationCycle, setAnimationCycle] = useState(0);


  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  console.log("Animation start ", animationStart, "selected countries ");

  const [mapKey, setMapKey] = useState(0);
  // This runs on animation or manual select
  const triggerMapReset = (country:any) => {
    setSelectedCountry(country); 
     setAnimationCycle(prev => prev + 1);
  };

  useEffect(() => {
    if (!animationStart || (selectedCountry.length === 0 && selectedCountry === null)) {
      // console.log("⛔ Animation not started or no selected countries.", selectedCountry, animationStart);
      return;
    }



    const play = () => {
      const country = selectedCountry;
      if (!country) return;

      // Reset selected country
      setSelectedCountry("");
      // console.log("🧹 Cleared selected country");

      setTimeout(() => {
        // console.log("🎯 Re-setting selected country:", country);
        triggerMapReset(country);            // 🔁 Triggers <Map2> remount
        // setSelectedCountry(country);  // ✅ Important
      }, 4000);
    };

    play(); // Trigger first manually

    intervalRef.current = setInterval(() => {
      console.log("⏱️ Next animation cycle");
      play();
    }, 10000); // every 4s

    return () => {
      // console.log("🧼 Clearing interval");
      //@ts-ignore
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    };
  }, [animationStart]);


  const mapContainerRef = useRef<HTMLDivElement>(null);


  const enterFullscreen = () => {
  const elem = mapContainerRef.current;
  if (elem) {
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if ((elem as any).webkitRequestFullscreen) {
      (elem as any).webkitRequestFullscreen(); // Safari
    } else if ((elem as any).msRequestFullscreen) {
      (elem as any).msRequestFullscreen(); // IE11
    }
  }
};



  return (
    <div>
      <MapConsole
        countries={countryList}
        selectedCountry={selectedCountry}
        onSelectCountry={(c) => {
          setSelectedCountry(c);         // Just show it, no animation
          setAnimationStart(false);      // ✅ Stop animation if selecting manually
        }}
        fillColor={fillColor}
        setFillColor={setFillColor}
        strokeColor={strokeColor}
        setStrokeColor={setStrokeColor}
        globalStrokeColor={globalStrokeColor}
        setGlobalStrokeColor={setGlobalStrokeColor}
        setAnimationStart={setAnimationStart}
        animationStart={animationStart}
        enterFullscreen={enterFullscreen}
      />

      <Map2
          mapContainerRef={mapContainerRef}
        selectedCountry={selectedCountry}
        onCountriesLoaded={setCountryList}
        fillColor={fillColor}
        strokeColor={strokeColor}
        globalStrokeColor={globalStrokeColor}
        animationStart={animationStart}
        key={mapKey}
          animationCycle={animationCycle}
      />
    </div>
  );
};

export default Page;

