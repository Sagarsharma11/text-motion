"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface LoopingBlurTextProps {
  text: string;
  style?: React.CSSProperties;
  interval?: number; // total interval between animations
}

const BlurIn = ({ text, style = {}, interval = 3000 }: LoopingBlurTextProps) => {
  const [loopKey, setLoopKey] = useState(0);

  useEffect(() => {
    const loop = setInterval(() => {
      setLoopKey((prev) => prev + 1);
    }, interval);

    return () => clearInterval(loop);
  }, [interval]);

  return (
    <motion.div
      key={loopKey}
      initial={{ opacity: 0, filter: "blur(12px)", y: 30 }}
      animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
      transition={{
        duration: 1.2,
        ease: "easeOut",
      }}
      className="text-center"
      style={style}
    >
      {text}
    </motion.div>
  );
};

export default BlurIn;
