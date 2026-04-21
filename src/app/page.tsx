"use client";

import { useState } from "react";
import {
  FaEnvelope,
  FaGithub,
  FaLinkedin,
  FaStrava,
  FaXTwitter,
  FaBlogger,
  FaRegBookmark,
} from "react-icons/fa6";
import { motion, type Variants } from "framer-motion";
import type { IconType } from "react-icons";

import AsciiBackground from "@/components/AsciiBackground";
import DitheredLogo from "@/components/DitheredLogo";
import ProjectLink from "@/components/ProjectLink";
import TextScramble from "@/components/TextScramble";
import TypewriterLabel from "@/components/TypewriterLabel";

type LinkItem = {
  label: string;
  href: string;
  icon: IconType;
};

const container: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.2 },
  },
};

const fade: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
  },
};

const links: LinkItem[] = [
  { label: "email", href: "mailto:raj@rajjoshi.me", icon: FaEnvelope },
  { label: "blog", href: "https://blog.rajjoshi.me", icon: FaBlogger },
  { label: "clip", href: "https://clip.rajjoshi.me", icon: FaRegBookmark },
  { label: "github", href: "https://www.github.com/iamrajjoshi/", icon: FaGithub },
  { label: "linkedin", href: "https://www.linkedin.com/in/rajjoshi-/", icon: FaLinkedin },
  { label: "strava", href: "https://www.strava.com/athletes/rajjoshi", icon: FaStrava },
  { label: "x", href: "https://x.com/iamrajjoshi_", icon: FaXTwitter },
];

const projects: {
  title: string;
  description: string;
  descriptionLines?: string[];
  href: string;
  iconSrc?: string;
  icon?: IconType;
}[] = [
  {
    title: "willow",
    description: "git worktree manager for AI agent workflows",
    descriptionLines: ["git worktree manager", "for AI agent workflows"],
    href: "https://getwillow.dev",
    iconSrc: "/projects/willow.svg",
  },
  {
    title: "curfew",
    description: "local-first terminal curfew for your quiet hours",
    descriptionLines: ["local-first terminal curfew", "for your quiet hours"],
    href: "https://github.com/iamrajjoshi/curfew",
    iconSrc: "/projects/curfew.svg",
  },
  {
    title: "error generator",
    description: "send sample Sentry errors to your project",
    descriptionLines: ["send sample Sentry errors", "to your project"],
    href: "https://github.com/getsentry/error-generator",
    iconSrc: "/projects/error-generator.svg",
  },
];

export default function App() {
  const [nameComplete, setNameComplete] = useState(false);
  const [bioComplete, setBioComplete] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <AsciiBackground />

      <motion.div variants={container} initial="hidden" animate="visible">
        <div className="flex flex-col gap-8 items-start max-w-[540px]">
          <motion.div variants={fade}>
            <DitheredLogo src="/octopus.png" size={150} className="rounded-full" />
          </motion.div>

          <motion.div variants={fade}>
            <TextScramble
              as="h1"
              className="text-5xl md:text-6xl font-heading font-bold tracking-[-0.03em] text-white leading-[1.05]"
              duration={800}
              onComplete={() => setNameComplete(true)}
            >
              raj joshi
            </TextScramble>
          </motion.div>

          <motion.div variants={fade}>
            {bioComplete ? (
              <div>
                <p className="text-xl md:text-2xl text-zinc-500 leading-[1.65]">
                  swe at{" "}
                  <a
                    href="https://www.ziphq.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-zinc-300 hover:text-white bio-link transition-colors"
                  >
                    Zip
                  </a>
                  , previously at{" "}
                  <a
                    href="https://www.sentry.io/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-zinc-300 hover:text-white bio-link transition-colors"
                  >
                    sentry.io
                  </a>
                  .
                </p>
                <p className="text-xl md:text-2xl text-zinc-500 leading-[1.65]">
                  if i&apos;m not coding, i&apos;m probably{" "}
                  <a
                    href="https://xkcd.com/189/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-zinc-300 hover:text-white bio-link transition-colors"
                  >
                    running
                  </a>
                  .
                </p>
              </div>
            ) : (
              <div>
                <TextScramble
                  className="text-xl md:text-2xl text-zinc-500 leading-[1.65]"
                  delay={nameComplete ? 0 : 99999}
                  duration={1000}
                >
                  {"swe at Zip, previously at sentry.io."}
                </TextScramble>
                <TextScramble
                  className="text-xl md:text-2xl text-zinc-500 leading-[1.65]"
                  delay={nameComplete ? 200 : 99999}
                  duration={1000}
                  onComplete={() => setBioComplete(true)}
                >
                  {"if i'm not coding, i'm probably running."}
                </TextScramble>
              </div>
            )}
          </motion.div>

          <motion.div variants={fade}>
            <div className="flex gap-5">
              {links.map((link) => {
                const Icon = link.icon;
                return (
                  <TypewriterLabel
                    key={link.label}
                    label={link.label}
                    href={link.href}
                    className="text-base md:text-lg text-zinc-600 hover:text-white transition-all hover:-translate-y-px"
                  >
                    <Icon size={20} />
                  </TypewriterLabel>
                );
              })}
            </div>
          </motion.div>

          <motion.div variants={fade}>
            <div className="w-full">
              <p className="mb-3 text-base md:text-lg font-medium tracking-[0.16em] text-zinc-600">
                stuff i made
              </p>
              <nav
                aria-label="project showcase"
                className="flex flex-col gap-3 md:flex-row md:flex-wrap md:justify-start md:items-start md:gap-x-6 md:gap-y-0"
              >
                {projects.map((project) => (
                  <ProjectLink
                    key={project.title}
                    {...project}
                    destinationLabel={
                      project.href.includes("github.com") ? "GitHub" : "website"
                    }
                  />
                ))}
              </nav>
            </div>
          </motion.div>
        </div>
      </motion.div>

      <footer className="fixed bottom-0 w-full pb-8">
        <p className="text-center text-sm text-zinc-600">
          <a
            href={`https://github.com/iamrajjoshi/iamrajjoshi.github.io/commit/${process.env.NEXT_PUBLIC_COMMIT_SHA}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bio-link hover:text-zinc-400 transition-colors font-mono"
          >
            {process.env.NEXT_PUBLIC_COMMIT_SHA}
          </a>
        </p>
      </footer>
    </div>
  );
}
