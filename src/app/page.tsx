"use client";

import { useState } from "react";
import {
  FaEnvelope,
  FaGithub,
  FaLinkedin,
  FaStrava,
  FaXTwitter,
  FaBlogger,
} from "react-icons/fa6";
import { motion, type Variants } from "framer-motion";
import type { IconType } from "react-icons";

import AsciiBackground from "@/components/AsciiBackground";
import DitheredLogo from "@/components/DitheredLogo";
import TextScramble from "@/components/TextScramble";
import TypewriterLabel from "@/components/TypewriterLabel";

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

const links: { label: string; href: string; icon: IconType }[] = [
  { label: "email", href: "mailto:raj@rajjoshi.me", icon: FaEnvelope },
  { label: "blog", href: "https://blog.rajjoshi.me", icon: FaBlogger },
  { label: "github", href: "https://www.github.com/iamrajjoshi/", icon: FaGithub },
  { label: "linkedin", href: "https://www.linkedin.com/in/rajjoshi-/", icon: FaLinkedin },
  { label: "strava", href: "https://www.strava.com/athletes/rajjoshi", icon: FaStrava },
  { label: "x", href: "https://x.com/rajjoshi_22", icon: FaXTwitter },
];

export default function App() {
  const [nameComplete, setNameComplete] = useState(false);
  const [bioComplete, setBioComplete] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <AsciiBackground />

      <motion.div variants={container} initial="hidden" animate="visible">
        <div className="flex flex-col gap-8 items-start max-w-[480px]">
          <motion.div variants={fade}>
            <DitheredLogo src="/octopus.png" size={150} className="rounded-full" />
          </motion.div>

          <motion.div variants={fade}>
            <TextScramble
              as="h1"
              className="text-4xl md:text-5xl font-heading font-bold tracking-[-0.03em] text-white leading-[1.1]"
              duration={800}
              onComplete={() => setNameComplete(true)}
            >
              raj joshi
            </TextScramble>
          </motion.div>

          <motion.div variants={fade}>
            {bioComplete ? (
              <div>
                <p className="text-lg md:text-xl text-zinc-500 leading-[1.7]">
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
                <p className="text-lg md:text-xl text-zinc-500 leading-[1.7]">
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
                  className="text-lg md:text-xl text-zinc-500 leading-[1.7]"
                  delay={nameComplete ? 0 : 99999}
                  duration={1000}
                >
                  {"swe at Zip, previously at sentry.io."}
                </TextScramble>
                <TextScramble
                  className="text-lg md:text-xl text-zinc-500 leading-[1.7]"
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
                    className="text-zinc-600 hover:text-white transition-all hover:-translate-y-px"
                  >
                    <Icon size={18} />
                  </TypewriterLabel>
                );
              })}
            </div>
          </motion.div>
        </div>
      </motion.div>

      <footer className="fixed bottom-0 w-full pb-8">
        <p className="text-center text-xs text-zinc-600">
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
