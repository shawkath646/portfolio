"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const headingText = "Shawkat Hossain Maruf";

export default function AnimatedHeading() {
  // Animation settings
  const [displayText, setDisplayText] = useState("");
  const [isErasing, setIsErasing] = useState(false);
  const [idx, setIdx] = useState(0);

  // Bar can be "|" or "/"
  const barChar = "|"; // Change to "/" if you prefer

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (!isErasing && idx <= headingText.length) {
      timeout = setTimeout(() => {
        setDisplayText(headingText.slice(0, idx));
        setIdx(idx + 1);
      }, 90);
    } else if (!isErasing && idx > headingText.length) {
      // Pause before erasing
      timeout = setTimeout(() => setIsErasing(true), 900);
    } else if (isErasing && idx >= 0) {
      timeout = setTimeout(() => {
        setDisplayText(headingText.slice(0, idx));
        setIdx(idx - 1);
      }, 40);
    } else if (isErasing && idx < 0) {
      // Pause before typing again
      timeout = setTimeout(() => {
        setIsErasing(false);
        setIdx(0);
      }, 600);
    }
    return () => clearTimeout(timeout);
  }, [idx, isErasing]);

  return (
    <motion.h1
      className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-cyan-600 dark:text-cyan-400 drop-shadow-md text-left min-h-[5rem] sm:min-h-[8rem] md:min-h-[5rem] flex items-start"
      initial={{ y: 60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
    >
      <span className="inline-block">
        Hi, I'm <span className="inline-block whitespace-nowrap">{displayText}<span className="animate-blink">{barChar}</span></span>
      </span>
      <style>
        {`
          .animate-blink {
            animation: blink 1s steps(1) infinite;
            display: inline-block;
          }
          @keyframes blink {
            0%, 50% { opacity: 1; }
            51%, 100% { opacity: 0; }
          }
        `}
      </style>
    </motion.h1>
  );
}