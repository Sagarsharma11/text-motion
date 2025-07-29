"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface AnimatedTextProps {
  text: string;
  style?: React.CSSProperties;
}

const LiftUpAnimation = ({ text, style = {} }: AnimatedTextProps) => {
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
              initial={{ opacity: 0, filter: "blur(4px)", y: 40 }}
              animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
              transition={{
                delay: (wordIdx * 5 + charIdx) * 0.05,
                duration: 0.6,
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

export default LiftUpAnimation;
