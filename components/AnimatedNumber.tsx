"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  value: number;
  decimals?: number;
  duration?: number;
}

export default function AnimatedNumber({ value, decimals = 0, duration = 600 }: Props) {
  const [display, setDisplay] = useState(value);
  const startRef = useRef(value);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    const start = startRef.current;
    const end = value;
    if (start === end) return;

    const startTime = performance.now();

    function step(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = start + (end - start) * eased;
      setDisplay(current);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(step);
      } else {
        startRef.current = end;
      }
    }

    frameRef.current = requestAnimationFrame(step);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [value, duration]);

  return <>{display.toFixed(decimals)}</>;
}
