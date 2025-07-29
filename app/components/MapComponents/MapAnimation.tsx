// "use client";

// import React, { useEffect, useRef } from "react";
// import * as d3 from "d3";
// import { feature } from "topojson-client";

// const MapAnimation = () => {
//   const svgRef = useRef<SVGSVGElement | null>(null);

//   useEffect(() => {
//     const loadMap = async () => {
//       try {
//         const res = await fetch(
//           "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"
//         );
//         if (!res.ok) throw new Error("Failed to fetch map data");

//         const worldData = await res.json();
//         const countries = feature(worldData, worldData.objects.countries).features;

//         const svg = d3.select(svgRef.current);
//         const width = 960;
//         const height = 500;

//         const projection = d3
//           .geoMercator()
//           .scale(150)
//           .translate([width / 2, height / 1.5]);
//         const pathGenerator = d3.geoPath().projection(projection);

//         svg
//           .attr("width", width)
//           .attr("height", height)
//           .style("background", "#000");

//         svg
//           .selectAll("path")
//           .data(countries)
//           .join("path")
//           .attr("d", pathGenerator)
//           .attr("fill", "none")
//           .attr("stroke", "#00e5ff")
//           .attr("stroke-width", 0.6)
//           .attr("stroke-dasharray", function () {
//             const totalLength = (this as SVGPathElement).getTotalLength();
//             return `${totalLength} ${totalLength}`;
//           })
//           .attr("stroke-dashoffset", function () {
//             return (this as SVGPathElement).getTotalLength();
//           })
//           .transition()
//           .duration(10000)
//           .ease(d3.easeCubicOut)
//           .attr("stroke-dashoffset", 0);
//       } catch (err) {
//         console.error("Error loading map:", err);
//       }
//     };

//     loadMap();
//   }, []);

//   return (
//     <div style={{ width: "100%", height: "100vh", backgroundColor: "#000", display: "flex", justifyContent: "center", alignItems: "center" }}>
//       <svg ref={svgRef}></svg>
//     </div>
//   );
// };

// export default MapAnimation;


// "use client";

// import React, { useEffect, useRef, useState } from "react";
// import * as d3 from "d3";
// import { feature } from "topojson-client";

// const MapAnimation = () => {
//   const svgRef = useRef<SVGSVGElement | null>(null);
//   const [countries, setCountries] = useState<any[]>([]);
//   const [selectedCountry, setSelectedCountry] = useState<string>("");

//   useEffect(() => {
//     const loadMap = async () => {
//       try {
//         const res = await fetch(
//           "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"
//         );
//         if (!res.ok) throw new Error("Failed to fetch map data");

//         const worldData = await res.json();
//         const features = feature(worldData, worldData.objects.countries).features;
//         setCountries(features);

//         const svg = d3.select(svgRef.current);
//         const width = 960;
//         const height = 500;

//         const projection = d3
//           .geoMercator()
//           .scale(150)
//           .translate([width / 2, height / 1.5]);
//         const pathGenerator = d3.geoPath().projection(projection);

//         svg
//           .attr("width", width)
//           .attr("height", height)
//           .style("background", "#000");

//         svg
//           .selectAll("path")
//           .data(features)
//           .join("path")
//           .attr("d", pathGenerator)
//           .attr("fill", "none")
//           .attr("stroke", "#00e5ff")
//           .attr("stroke-width", 0.6)
//           .attr("stroke-dasharray", function () {
//             const totalLength = (this as SVGPathElement).getTotalLength();
//             return `${totalLength} ${totalLength}`;
//           })
//           .attr("stroke-dashoffset", function () {
//             return (this as SVGPathElement).getTotalLength();
//           })
//           .transition()
//           .duration(3000)
//           .ease(d3.easeCubicOut)
//           .attr("stroke-dashoffset", 0);
//       } catch (err) {
//         console.error("Error loading map:", err);
//       }
//     };

//     loadMap();
//   }, []);

//   useEffect(() => {
//     if (!selectedCountry || countries.length === 0) return;

//     const svg = d3.select(svgRef.current);
//     const width = 960;
//     const height = 500;

//     const projection = d3.geoMercator();
//     const pathGenerator = d3.geoPath().projection(projection);

//     const country = countries.find((c) => c.properties.name === selectedCountry);
//     if (!country) return;

//     const bounds = pathGenerator.bounds(country);
//     const dx = bounds[1][0] - bounds[0][0];
//     const dy = bounds[1][1] - bounds[0][1];
//     const x = (bounds[0][0] + bounds[1][0]) / 2;
//     const y = (bounds[0][1] + bounds[1][1]) / 2;
//     const scale = Math.max(1, Math.min(8, 0.9 / Math.max(dx / width, dy / height)));
//     const translate = [width / 2 - scale * x, height / 2 - scale * y];

//     svg.selectAll("path")
//       .transition()
//       .duration(1000)
//       .attr("transform", `translate(${translate}) scale(${scale})`);
//   }, [selectedCountry, countries]);

//   return (
//     <div style={{ backgroundColor: "#000", width:"100%", height: "100vh", padding: "20px" }}>
//       <label style={{ color: "white" }}>
//         Select Country:{" "}
//         <select
//           value={selectedCountry}
//           onChange={(e) => setSelectedCountry(e.target.value)}
//         >
//           <option value="">-- Choose --</option>
//           {countries.map((c) => (
//             <option key={c.id} value={c.properties.name}>
//               {c.properties.name}
//             </option>
//           ))}
//         </select>
//       </label>
//       <svg ref={svgRef}></svg>
//     </div>
//   );
// };

// export default MapAnimation;


"use client";

import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { feature } from "topojson-client";

const MapAnimation = () => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [countries, setCountries] = useState<any[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>("");

  const width = 960;
  const height = 500;

  useEffect(() => {
    const loadMap = async () => {
      const res = await fetch(
        "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"
      );
      const worldData = await res.json();
      //@ts-ignore
      const features = feature(worldData, worldData.objects.countries).features;
      setCountries(features);

      const svg = d3.select(svgRef.current);
      svg
        .attr("width", width)
        .attr("height", height)
        .style("background", "#000");

      const projection = d3
        .geoMercator()
        .scale(150)
        .translate([width / 2, height / 1.5]);

      const pathGenerator = d3.geoPath().projection(projection);

      svg
        .selectAll("path")
        .data(features)
        .join("path")
        .attr("d", pathGenerator as any)
        .attr("fill", "none")
        .attr("stroke", "#00e5ff")
        .attr("stroke-width", 0.6)
        .attr("stroke-dasharray", function () {
          const totalLength = (this as SVGPathElement).getTotalLength();
          return `${totalLength} ${totalLength}`;
        })
        .attr("stroke-dashoffset", function () {
          return (this as SVGPathElement).getTotalLength();
        })
        .transition()
        .duration(2000)
        .attr("stroke-dashoffset", 0);
    };

    loadMap();
  }, []);

  useEffect(() => {
    if (!selectedCountry || countries.length === 0) return;

    const svg = d3.select(svgRef.current);
    const g = svg.select("g");

    const projection = d3
      .geoMercator()
      .scale(150)
      .translate([width / 2, height / 1.5]);

    const path = d3.geoPath().projection(projection);

    const country = countries.find((c) => c.properties.name === selectedCountry);
    if (!country) return;

    const bounds = path.bounds(country);
    const dx = bounds[1][0] - bounds[0][0];
    const dy = bounds[1][1] - bounds[0][1];
    const x = (bounds[0][0] + bounds[1][0]) / 2;
    const y = (bounds[0][1] + bounds[1][1]) / 2;
    const scale = Math.max(1, Math.min(8, 0.9 / Math.max(dx / width, dy / height)));
    const translate = [width / 2 - scale * x, height / 2 - scale * y];

    svg
      .selectAll("path")
      .transition()
      .duration(1000)
      .attr("transform", `translate(${translate}) scale(${scale})`)
      .attr("fill", (d: any) =>
        d.properties.name === selectedCountry ? "#ff4081" : "none"
      )
      .attr("stroke", (d: any) =>
        d.properties.name === selectedCountry ? "#fff" : "#00e5ff"
      )
      .attr("stroke-width", (d: any) =>
        d.properties.name === selectedCountry ? 1.2 : 0.6
      );
  }, [selectedCountry]);

  return (
     <div style={{ width: "100%", height: "100vh", backgroundColor: "#000" }}>

      <label style={{ color: "white" }}>
        Select Country:{" "}
        <select
          value={selectedCountry}
          onChange={(e) => setSelectedCountry(e.target.value)}
        >
          <option value="">-- Choose --</option>
          {countries.map((c) => (
            <option key={c.properties.name} value={c.properties.name}>
              {c.properties.name}
            </option>
          ))}
        </select>
      </label>
      <svg ref={svgRef}>
        <g />
      </svg>
    </div>
  );
};

export default MapAnimation;
