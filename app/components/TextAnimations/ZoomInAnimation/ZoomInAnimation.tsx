"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface ZoomInAnimationProps {
  text: string;
  style?: React.CSSProperties;
}

const ZoomInAnimation = ({ text, style = {} }: ZoomInAnimationProps) => {
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationKey((prev) => prev + 1);
    }, text.length * 50 + 1000);

    return () => clearInterval(interval);
  }, [text]);

  return (
    <div
      key={animationKey}
      className="overflow-hidden flex flex-wrap font-mono"
      style={style}
    >
      {text.split(" ").map((word, wordIdx) => (
        <span key={wordIdx} className="mr-2 inline-flex">
          {word.split("").map((char, charIdx) => (
            <motion.span
              key={charIdx}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                delay: (wordIdx * 5 + charIdx) * 0.05,
                duration: .5,
                ease: "easeOut",
              }}
              className="inline-block"
            >
              {char}
            </motion.span>
          ))}
        </span>
      ))}
    </div>
  );
};

export default ZoomInAnimation;
