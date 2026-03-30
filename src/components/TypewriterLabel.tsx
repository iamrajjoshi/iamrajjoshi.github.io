"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

type TypewriterLabelProps = {
  label: string;
  children: React.ReactNode;
  href: string;
  className?: string;
  target?: string;
  rel?: string;
};

const CHAR_STAGGER_MS = 30;

function measureCharWidths(text: string, font: string): number[] {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;
  ctx.font = font;
  return Array.from(text).map((char) => ctx.measureText(char).width);
}

export default function TypewriterLabel({
  label,
  children,
  href,
  className,
  target = "_blank",
  rel = "noopener noreferrer",
}: TypewriterLabelProps) {
  const reducedMotion = useReducedMotion();
  const [fontsReady, setFontsReady] = useState(false);
  const [font, setFont] = useState<string | null>(null);
  const [charWidths, setCharWidths] = useState<number[]>([]);
  const [totalWidth, setTotalWidth] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [visibleCount, setVisibleCount] = useState(0);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const containerRef = useRef<HTMLAnchorElement | null>(null);

  const chars = Array.from(label);

  // Wait for fonts to load
  useEffect(() => {
    let cancelled = false;
    document.fonts.ready.then(() => {
      if (!cancelled) setFontsReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Detect font from rendered element
  const refCallback = useCallback(
    (node: HTMLAnchorElement | null) => {
      containerRef.current = node;
      if (node && fontsReady) {
        const style = getComputedStyle(node);
        const size = style.fontSize;
        const weight = style.fontWeight;
        const fontStyle = style.fontStyle;
        const family = style.fontFamily
          .split(",")[0]
          .trim()
          .replace(/['"]/g, "");
        const parts: string[] = [];
        if (fontStyle && fontStyle !== "normal") parts.push(fontStyle);
        if (weight && weight !== "400") parts.push(weight);
        parts.push(size);
        parts.push(family);
        setFont(parts.join(" "));
      }
    },
    [fontsReady],
  );

  // Measure widths when font is ready
  useEffect(() => {
    if (!font || !label) return;
    const widths = measureCharWidths(label, font);
    setCharWidths(widths);
    setTotalWidth(widths.reduce((sum, w) => sum + w, 0));
  }, [font, label]);

  // Animate visible count on hover change
  useEffect(() => {
    if (reducedMotion) {
      setVisibleCount(hovered ? chars.length : 0);
      return;
    }

    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (hovered) {
      intervalRef.current = setInterval(() => {
        setVisibleCount((prev) => {
          if (prev >= chars.length) {
            if (intervalRef.current !== null) {
              clearInterval(intervalRef.current);
              intervalRef.current = null;
            }
            return prev;
          }
          return prev + 1;
        });
      }, CHAR_STAGGER_MS);
    } else {
      intervalRef.current = setInterval(() => {
        setVisibleCount((prev) => {
          if (prev <= 0) {
            if (intervalRef.current !== null) {
              clearInterval(intervalRef.current);
              intervalRef.current = null;
            }
            return 0;
          }
          return prev - 1;
        });
      }, CHAR_STAGGER_MS);
    }

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [hovered, chars.length, reducedMotion]);

  const expanded = hovered || visibleCount > 0;

  return (
    <a
      href={href}
      target={target}
      rel={rel}
      aria-label={label}
      className={className}
      ref={refCallback}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
    >
      <span>{children}</span>
      <span
        style={{
          width: expanded ? totalWidth : 0,
          overflow: "hidden",
          transition: "width 0.3s ease",
          display: "inline-flex",
          whiteSpace: "nowrap",
        }}
      >
        {chars.map((c, i) => (
          <span
            key={i}
            style={{
              display: "inline-block",
              width: charWidths[i] ?? undefined,
              opacity: visibleCount > i ? 1 : 0,
              transform:
                visibleCount > i ? "translateY(0)" : "translateY(4px)",
              transition: "opacity 0.1s ease, transform 0.1s ease",
            }}
          >
            {c}
          </span>
        ))}
      </span>
    </a>
  );
}
