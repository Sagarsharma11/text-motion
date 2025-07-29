"use client";

import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { feature } from "topojson-client";
import data from "./worldJson.json"

interface Props {
  selectedCountry: string;
  onCountriesLoaded: (names: string[]) => void;
}

const WorldMap: React.FC<Props> = ({ selectedCountry, onCountriesLoaded }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [countriesData, setCountriesData] = useState<any[]>([]);

  const width = window.innerWidth;
  const height = window.innerHeight;

  useEffect(() => {
    const loadMap = async () => {
    //   const res = await fetch(
    //     "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"
    //   );
    //   const worldData = await res.json();

    //   const features = feature(worldData, worldData.objects.countries).features;
    //@ts-ignore
     const features = feature(data, data.objects.countries).features;
      setCountriesData(features);
      onCountriesLoaded(features.map((c: any) => c.properties.name));

      const svg = d3.select(svgRef.current);
      const g = svg.select("g");

      svg
        .attr("width", width)
        .attr("height", height)
        .style("background", "#000");

      const projection = d3
        .geoMercator()
        .scale(width / 6.3)
        .translate([width / 2, height / 1.65]);

      const path = d3.geoPath().projection(projection);

      g.selectAll("path")
        .data(features)
        .join("path")
        .attr("d", path as any)
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
        .duration(1500)
        .attr("stroke-dashoffset", 0);
    };

    loadMap();
  }, []);

  useEffect(() => {
    if (!selectedCountry || countriesData.length === 0) return;

    const svg = d3.select(svgRef.current);
    const g = svg.select("g");

    const projection = d3
      .geoMercator()
      .scale(width / 6.3)
      .translate([width / 2, height / 1.65]);

    const path = d3.geoPath().projection(projection);
    const country = countriesData.find(
      (c: any) => c.properties.name === selectedCountry
    );
    if (!country) return;

    const bounds = path.bounds(country);
    const dx = bounds[1][0] - bounds[0][0];
    const dy = bounds[1][1] - bounds[0][1];
    const x = (bounds[0][0] + bounds[1][0]) / 2;
    const y = (bounds[0][1] + bounds[1][1]) / 2;
    const scale = Math.max(1, Math.min(8, 0.9 / Math.max(dx / width, dy / height)));
    const translate = [width / 2 - scale * x, height / 2 - scale * y];

    g.selectAll("path")
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
    <svg ref={svgRef}>
      <g />
    </svg>
  );
};

export default WorldMap;
