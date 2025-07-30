import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';

const SampleWorldMaps = () => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // clear previous render

    const width = window.innerWidth;
    const height = window.innerHeight;

    const projection = d3.geoNaturalEarth1()
      .scale(width / 6.5)
      .translate([width / 2, height / 2]);

    const path = d3.geoPath().projection(projection);

    const drawMap = async () => {
      const worldData = await d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json');
      const countries = topojson.feature(worldData as any, (worldData as any).objects.countries).features;

      svg
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .selectAll('path')
        .data(countries)
        .enter()
        .append('path')
        .attr('d', path)
        .attr('fill', 'orange')
        .attr('stroke', '#fff')
        .attr('stroke-width', 0.5);
    };

    drawMap();

    // Optional: Redraw on resize
    const handleResize = () => drawMap();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="w-screen h-screen overflow-hidden border">
      <svg ref={svgRef} className="w-full h-full"></svg>
    </div>
  );
};

export default SampleWorldMaps;
