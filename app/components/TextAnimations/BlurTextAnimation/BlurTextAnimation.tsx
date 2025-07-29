"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface BlurTextAnimationProps {
    text: string;
    style?: React.CSSProperties;
    interval?: number; // milliseconds between animation cycles
}

const BlurTextAnimation = ({ text, style = {}, interval = 3000 }: BlurTextAnimationProps) => {
    const [animationKey, setAnimationKey] = useState(0);

    useEffect(() => {
        const cycle = setInterval(() => {
            setAnimationKey((prev) => prev + 1);
        }, interval);
        return () => clearInterval(cycle);
    }, [interval]);

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
                            initial={{ opacity: 0, filter: "blur(10px)", y: 40 }} // ← Increased blur
                            animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                            exit={{ opacity: 0, filter: "blur(4px)", y: -10 }}
                            transition={{
                                delay: (wordIdx * 5 + charIdx) * 0.04,
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

export default BlurTextAnimation;
