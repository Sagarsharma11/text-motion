"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface TypewriterProps {
  text: string;
  style?: React.CSSProperties;
}

const Typewriter = ({ text = "", style = {} }: TypewriterProps) => {
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationKey((prev) => prev + 1);
    }, text.length * 50 + 1000); // restart after full text + delay

    return () => clearInterval(interval);
  }, [text]);

  return (
    <div
      key={animationKey}
      className="font-mono p-6 min-h-[120px] bg-transparent rounded-md whitespace-pre-wrap"
      style={style}
    >
      {text.split("").map((char, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            delay: index * 0.05,
            duration: 0.4,
          }}
          className="inline-block"
        >
          {char}
        </motion.span>
      ))}
    </div>
  );
};

export default Typewriter;
