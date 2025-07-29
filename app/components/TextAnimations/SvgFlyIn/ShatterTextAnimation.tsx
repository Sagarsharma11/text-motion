"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

interface BreakAndReassembleTextProps {
  text: string;
  style?: React.CSSProperties;
}

const ShatterTextAnimation = ({ text, style = {} }: BreakAndReassembleTextProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const chars = containerRef.current?.querySelectorAll(".char");

    if (!chars) return;

    const breakTimeline = gsap.timeline({ repeat: -1, repeatDelay: 1 });

    breakTimeline.to(chars, {
      duration: 0.5,
      opacity: 0,
      rotate: () => gsap.utils.random(-180, 180),
      x: () => gsap.utils.random(-100, 100),
      y: () => gsap.utils.random(-100, 100),
      scale: 0.1,
      stagger: 0.03,
      ease: "power3.out",
    });

    breakTimeline.to(chars, {
      duration: 0.8,
      opacity: 1,
      rotate: 0,
      x: 0,
      y: 0,
      scale: 1,
      stagger: 0.03,
      ease: "power3.inOut",
    });

    return () => {
      breakTimeline.kill();
    };
  }, [text]);

  return (
    <div
      ref={containerRef}
      className="flex flex-wrap font-black text-6xl"
      style={{ ...style }}
    >
      {text.split("").map((char, idx) => (
        <span
          key={idx}
          className="char inline-block"
          style={{ display: "inline-block", willChange: "transform" }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </div>
  );
};

export default ShatterTextAnimation;
