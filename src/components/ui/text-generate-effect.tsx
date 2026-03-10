"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface TextGenerateEffectProps {
  words: string;
  className?: string;
  filter?: boolean;
  duration?: number;
}

export function TextGenerateEffect({
  words,
  className,
  filter = true,
  duration = 0.5,
}: TextGenerateEffectProps) {
  const [scope, setScope] = useState(false);
  const wordsArray = words.split(" ");

  useEffect(() => {
    setScope(true);
  }, []);

  return (
    <div className={cn("font-bold", className)}>
      <div className="mt-4">
        <div className="leading-snug tracking-wide">
          {wordsArray.map((word, idx) => (
            <motion.span
              key={`${word}-${idx}`}
              initial={{ opacity: 0, filter: filter ? "blur(10px)" : "none" }}
              animate={scope ? { opacity: 1, filter: filter ? "blur(0px)" : "none" } : {}}
              transition={{
                duration: duration,
                delay: idx * 0.08,
                ease: "easeOut",
              }}
              className="inline-block mr-[0.25em]"
            >
              {word}
            </motion.span>
          ))}
        </div>
      </div>
    </div>
  );
}
