"use client";

import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { feature } from "topojson-client";
import worldData from "./worldJson.json";
import lineData from "./lines.topo.json";
import styles from "./map2.module.css"

const Map2 = ({ selectedCountry, onCountriesLoaded, fillColor, strokeColor, globalStrokeColor, animationStart,
    key, animationCycle, mapContainerRef, fullscreenTriggered
}: any) => {
    const svgRef = useRef<SVGSVGElement | null>(null);
    const [countriesData, setCountriesData] = useState<any[]>([]);
    const [lineFeatures, setLineFeatures] = useState<any[]>([]);

    const width = window.innerWidth;
    const height = window.innerHeight;

    useEffect(() => {
        const loadMap = async () => {
            //@ts-ignore
            const countryFeatures = feature(worldData, worldData.objects.countries).features;
            //@ts-ignore
            const lines = feature(lineData, lineData.objects.lines).features;

            setCountriesData(countryFeatures);
            setLineFeatures(lines);
            onCountriesLoaded(countryFeatures.map((c: any) => c.properties.name));

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

            // Draw countries
            g.selectAll("path.country")
                .data(countryFeatures)
                .join("path")
                .attr("class", "country")
                .attr("d", path as any)
                .attr("fill", "none")
                .attr("stroke", globalStrokeColor)
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

    // 🔴 Lines rendering or removal logic
    useEffect(() => {
        const svg = d3.select(svgRef.current);
        const g = svg.select("g");

        const projection = d3
            .geoMercator()
            .scale(width / 6.3)
            .translate([width / 2, height / 1.65]);

        const path = d3.geoPath().projection(projection);

        g.selectAll("path.line")
            .data(lineFeatures)
            .join("path")
            .attr("class", "line")
            .attr("d", path as any)
            .attr("fill", (d: any) => {
                if (selectedCountry === "India") {
                    return fillColor
                }
                return "none"
            })
            .attr("stroke", (d: any) => {
                if (selectedCountry === "India") return strokeColor
                return globalStrokeColor
            })
            .attr("stroke-width", (d: any) => {
                const name1 = d.properties.name1;
                const name2 = d.properties.name2;

                const isIndiaPakistan =
                    (name1 === "India" && name2 === "Pakistan") ||
                    (name1 === "Pakistan" && name2 === "India");

                return isIndiaPakistan ? 1.5 : 0.6;
            })
            .attr("stroke-dasharray", function () {
                const totalLength = (this as SVGPathElement).getTotalLength();
                return `${totalLength} ${totalLength}`;
            })
            .attr("stroke-dashoffset", function () {
                return (this as SVGPathElement).getTotalLength();
            })
            .transition()
            .duration(1200)
            .ease(d3.easeLinear)
            .attr("stroke-dashoffset", 0);


        if (selectedCountry === "" || selectedCountry === "India" ||
            selectedCountry === "Pakistan" || selectedCountry === "Bangladesh"
            || selectedCountry === "Bhutan" || selectedCountry === "Nepal"

        ) {
            const projection = d3
                .geoMercator()
                .scale(width / 6.3)
                .translate([width / 2, height / 1.65]);

            const path = d3.geoPath().projection(projection);

            g.selectAll("path.line")
                .data(lineFeatures)
                .enter()
                .append("path")
                .attr("class", "line")
                .attr("d", path as any)
                .attr("fill", "none")
                .attr("stroke", globalStrokeColor)
                .attr("stroke-width", 0.6)
                .attr("stroke-dasharray", function () {
                    const totalLength = (this as SVGPathElement).getTotalLength();
                    return `${totalLength} ${totalLength}`;
                })
                .attr("stroke-dashoffset", function () {
                    return (this as SVGPathElement).getTotalLength();
                })
                .transition()
                .duration(1200)
                .ease(d3.easeLinear)
                .attr("stroke-dashoffset", 0);
        }
    }, [selectedCountry, lineFeatures]);

    // // Zoom to selected country
    useEffect(() => {
        if (!svgRef.current || countriesData.length === 0) return;

        const svg = d3.select(svgRef.current);
        const g = svg.select("g");

        const projection = d3
            .geoMercator()
            .scale(width / 6.3)
            .translate([width / 2, height / 1.65]);

        const path = d3.geoPath().projection(projection);

        // 🔁 RESET when no country is selected
        if (!selectedCountry) {
            // Reset zoom
            g.transition()
                .duration(1000)
                .attr("transform", `translate(0,0) scale(1)`);

            // Reset all country styles
            g.selectAll("path.country")
                .transition()
                .duration(1000)
                .attr("fill", "none")
                .attr("stroke", globalStrokeColor)
                .attr("stroke-width", 0.6);

            return; // ✅ Skip the zoom-in logic
        }

        // 🔍 ZOOM IN to selected country
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

        // 🧼 Step 1: Reset zoom first
        g.transition()
            .duration(400)
            .attr("transform", `translate(0,0) scale(1)`)
            .on("end", () => {
                // ✅ Zoom in
                g.transition()
                    .duration(2000)
                    .attr("transform", `translate(${translate}) scale(${scale})`)
                    .on("end", () => {
                        // ✅ THEN apply coloring
                        g.selectAll("path.country")
                            .transition()
                            .duration(1000)
                            .attr("fill", (d: any) => {
                                if (selectedCountry === "Pakistan") return "none";
                                if (d.properties.name === selectedCountry && selectedCountry === "India") return fillColor;
                                return d.properties.name === selectedCountry ? fillColor : "#0a192f";
                            })
                            .attr("stroke", (d: any) =>
                                d.properties.name === selectedCountry && selectedCountry !== "Pakistan"
                                    ? strokeColor
                                    : globalStrokeColor
                            )
                            .attr("stroke-width", (d: any) =>
                                d.properties.name === selectedCountry && selectedCountry !== "Pakistan" ? 1 : 0.6
                            );
                    });
            });


        // 🎨 Set fill/stroke for countries
        g.selectAll("path.country")
            .transition()
            .duration(1000)
            .attr("fill", (d: any) => {
                if (selectedCountry === "Pakistan") return "none";
                if (d.properties.name === selectedCountry && selectedCountry === "India") return fillColor;
                return d.properties.name === selectedCountry ? fillColor : "#0a192f";
            })
            .attr("stroke", (d: any) =>
                d.properties.name === selectedCountry && selectedCountry !== "Pakistan" ? strokeColor : globalStrokeColor
            )
            .attr("stroke-width", (d: any) =>
                d.properties.name === selectedCountry && selectedCountry !== "Pakistan" ? 1 : 0.6
            );

        // Tooltip logic...
        if (selectedCountry && country) {
            const tooltip = d3.select("#tooltip");

            const [x0, y0] = path.bounds(country)[0];
            const [x1, y1] = path.bounds(country)[1];

            const centerX = (x0 + x1) / 2;
            const centerY = (y0 + y1) / 2;

            const transform = d3.zoomIdentity
                .translate(width / 2 - scale * centerX, height / 2 - scale * centerY)
                .scale(scale);

            const screenX = transform.applyX(centerX);
            const screenY = transform.applyY(centerY);

            setTimeout(() => {
                tooltip
                    .text(selectedCountry)
                    .style("left", `${screenX}px`)
                    .style("top", `${screenY}px`)
                    .style("visibility", "visible")
                    .style("opacity", "1");

                setTimeout(() => {
                    tooltip.style("opacity", "0");
                    setTimeout(() => {
                        tooltip.style("visibility", "hidden");
                    }, 500);
                }, 1000);
            }, 5000);
        }
    }, [selectedCountry, animationCycle]);


    // 🔁 Re-trigger world outline animation every time animationCycle changes
    useEffect(() => {
        if (!svgRef.current || countriesData.length === 0) return;

        const svg = d3.select(svgRef.current);
        const g = svg.select("g");

        // Re-animate the country outlines
        g.selectAll("path.country")
            .attr("stroke-dasharray", function () {
                const totalLength = (this as SVGPathElement).getTotalLength();
                return `${totalLength} ${totalLength}`;
            })
            .attr("stroke-dashoffset", function () {
                return (this as SVGPathElement).getTotalLength();
            })
            .transition()
            .duration(1500)
            .ease(d3.easeLinear)
            .attr("stroke-dashoffset", 0);
    }, [animationCycle]);

    // Effect to observe the screen size 
    const hasMounted = useRef(false);

    useEffect(() => {
        if (!hasMounted.current) {
            hasMounted.current = true;
            return; // ⛔ skip initial run
        }

        const svg = d3.select(svgRef.current);
        if (!svgRef.current || !mapContainerRef.current) return;

        const newWidth = mapContainerRef.current.clientWidth;
        const newHeight = mapContainerRef.current.clientHeight;

        svg.attr("width", newWidth).attr("height", newHeight);

        const g = svg.select("g");

        const projection = d3.geoMercator()
            .scale(newWidth / 6.3)
            .translate([newWidth / 2, newHeight / 1.65]);

        const path = d3.geoPath().projection(projection);

        g.selectAll("path.country").attr("d", path);
        g.selectAll("path.line").attr("d", path);
    }, [fullscreenTriggered]);



    return (
        <div ref={mapContainerRef} >
            <div id="tooltip" className={styles["custom-tooltip"]}></div>
            <svg ref={svgRef}>
                <g />
            </svg>
        </div>
    );
};

export default Map2;
