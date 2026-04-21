"use client";

import { useState, type ReactNode } from "react";
import Image from "next/image";
import type { IconType } from "react-icons";

import { useReducedMotion } from "@/hooks/use-reduced-motion";

const CHAR_STAGGER_MS = 10;
const MAX_STAGGER_MS = 140;

type ProjectLinkProps = {
  title: string;
  description: string;
  descriptionLines?: string[];
  href: string;
  iconSrc?: string;
  icon?: IconType;
  destinationLabel: string;
};

export default function ProjectLink({
  title,
  description,
  descriptionLines,
  href,
  iconSrc,
  icon: Icon,
  destinationLabel,
}: ProjectLinkProps) {
  const reducedMotion = useReducedMotion();
  const [expanded, setExpanded] = useState(false);
  const descriptionNodes: ReactNode[] = [];
  const lines = descriptionLines?.length ? descriptionLines : [description];

  let charIndex = 0;
  for (let lineIndex = 0; lineIndex < lines.length; lineIndex += 1) {
    const line = lines[lineIndex];
    const tokens = line.split(/(\s+)/).filter(Boolean);
    const lineNodes: ReactNode[] = [];

    for (const token of tokens) {
      if (/^\s+$/.test(token)) {
        const spaces = Array.from(token);
        for (let spaceIndex = 0; spaceIndex < spaces.length; spaceIndex += 1) {
          const char = spaces[spaceIndex];
          const currentIndex = charIndex++;
          lineNodes.push(
            <span
              key={`${title}-space-${lineIndex}-${currentIndex}-${spaceIndex}`}
              className="project-description-space"
              style={{
                opacity: expanded ? 1 : 0,
                transitionDelay:
                  expanded && !reducedMotion
                    ? `${Math.min(currentIndex * CHAR_STAGGER_MS, MAX_STAGGER_MS)}ms`
                    : "0ms",
              }}
            >
              {char}
            </span>,
          );
        }
        continue;
      }

      const wordStart = charIndex;
      lineNodes.push(
        <span
          key={`${title}-word-${lineIndex}-${wordStart}`}
          className="project-description-word"
        >
          {Array.from(token).map((char) => {
            const currentIndex = charIndex++;
            return (
              <span
                key={`${title}-${lineIndex}-${currentIndex}`}
                className="project-description-char"
                style={{
                  opacity: expanded ? 1 : 0,
                  transform: expanded ? "translateY(0)" : "translateY(4px)",
                  transitionDelay:
                    expanded && !reducedMotion
                      ? `${Math.min(currentIndex * CHAR_STAGGER_MS, MAX_STAGGER_MS)}ms`
                      : "0ms",
                }}
              >
                {char}
              </span>
            );
          })}
        </span>,
      );
    }

    descriptionNodes.push(
      <span
        key={`${title}-line-${lineIndex}`}
        className="project-description-line"
      >
        {lineNodes}
      </span>,
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${title}: ${description}. Opens on ${destinationLabel}.`}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      onFocus={() => setExpanded(true)}
      onBlur={() => setExpanded(false)}
      className="project-link group flex w-full items-start gap-3 text-left text-zinc-600 transition-colors duration-200 hover:text-white focus-visible:text-white focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-teal-300/30 md:w-fit md:shrink-0 md:gap-2.5"
    >
      <span className="project-mark flex h-5 w-5 shrink-0 items-center justify-center md:h-4 md:w-4">
        {iconSrc ? (
          <Image
            src={iconSrc}
            alt=""
            aria-hidden
            width={20}
            height={20}
            unoptimized
            className="project-mark-image h-full w-full object-contain"
          />
        ) : null}
        {Icon ? (
          <Icon aria-hidden size={16} className="project-mark-icon" />
        ) : null}
      </span>

      <span className="project-copy min-w-0">
        <span className="project-title block text-base md:text-lg text-zinc-300">
          {title}
        </span>
        <span
          aria-hidden={!expanded}
          data-expanded={expanded ? "true" : undefined}
          className="project-description-shell block"
        >
          <span className="project-description-text block text-sm text-zinc-500">
            {descriptionNodes}
          </span>
        </span>
      </span>
    </a>
  );
}
