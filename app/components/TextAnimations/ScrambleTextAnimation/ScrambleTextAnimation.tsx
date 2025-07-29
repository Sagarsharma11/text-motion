"use client";

import React, { useEffect, useRef, useState } from "react";

interface ScrambleTextProps {
  text: string;
  style?: React.CSSProperties;
  duration?: number;
}

const ScrambleTextAnimation = ({
  text,
  style = {},
  duration = 1.5,
}: ScrambleTextProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [animationKey, setAnimationKey] = useState(0);
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*()_+-=[]{}";

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationKey((prev) => prev + 1);
    }, text.length * 100 + 2000);

    return () => clearInterval(interval);
  }, [text]);

  useEffect(() => {
    const spans = containerRef.current?.querySelectorAll("span[data-char]");

    if (!spans) return;

    spans.forEach((span, i) => {
      const originalChar = span.getAttribute("data-char");

      if (!originalChar || originalChar === " ") return;

      let frame = 0;
      const totalFrames = 10;

      const scramble = () => {
        const randomChar = characters[Math.floor(Math.random() * characters.length)];
        (span as HTMLElement).textContent =
          frame < totalFrames ? randomChar : originalChar;

        frame++;
        if (frame <= totalFrames) {
          setTimeout(scramble, 40);
        }
      };

      setTimeout(scramble, i * 40);
    });
  }, [animationKey, text]);

  return (
    <div
      ref={containerRef}
      key={animationKey}
      style={{
        display: "inline-flex",
        fontFamily: "monospace",
        fontSize: "2.5rem",
        gap: "0.15em",
        flexWrap: "wrap",
        ...style,
      }}
    >
      {text.split("").map((char, i) => (
        <span
          key={i}
          data-char={char}
          style={{
            whiteSpace: char === " " ? "pre" : "normal",
            minWidth: char === " " ? "0.5em" : "auto",
            WebkitTextStroke: '2px black',
            textShadow: `
  2px 0 0 red,     /* right */
  0 2px 0 red,     /* bottom */
  2px 2px 0 red    /* diagonal bottom-right */
`,

          }}

        >
          {char}
        </span>
      ))}
    </div>
  );
};

export default ScrambleTextAnimation;
