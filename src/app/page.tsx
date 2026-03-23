"use client";

import React from "react";
import {
  Flex,
  Heading,
  HStack,
  Link,
  Text,
  VStack,
} from "@chakra-ui/react";
import {
  FaEnvelope,
  FaGithub,
  FaLinkedin,
  FaStrava,
  FaXTwitter,
  FaBlogger,
} from "react-icons/fa6";
import { motion, type Variants } from "framer-motion";

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

const links = [
  { label: "email", href: "mailto:raj@rajjoshi.me", icon: FaEnvelope },
  { label: "blog", href: "https://blog.rajjoshi.me", icon: FaBlogger },
  { label: "github", href: "https://www.github.com/iamrajjoshi/", icon: FaGithub },
  { label: "linkedin", href: "https://www.linkedin.com/in/rajjoshi-/", icon: FaLinkedin },
  { label: "strava", href: "https://www.strava.com/athletes/rajjoshi", icon: FaStrava },
  { label: "x", href: "https://x.com/rajjoshi_22", icon: FaXTwitter },
];

export default function App() {
  return (
    <Flex minH="100vh" align="center" justify="center" px={6}>
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
        >
          <VStack spacing={8} align="start" maxW="480px">
            <motion.div variants={fade}>
              <Text fontSize="4xl" lineHeight="1">
                🐙
              </Text>
            </motion.div>

            <motion.div variants={fade}>
              <Heading
                as="h1"
                fontSize={{ base: "4xl", md: "5xl" }}
                lineHeight="1.1"
                color="white"
              >
                raj joshi
              </Heading>
            </motion.div>

            <motion.div variants={fade}>
              <Text
                fontSize={{ base: "lg", md: "xl" }}
                color="whiteAlpha.500"
                lineHeight="1.7"
              >
                swe at{" "}
                <Link href="https://www.ziphq.com/" isExternal color="whiteAlpha.800" _hover={{ color: "white" }} className="bio-link">
                  Zip
                </Link>
                , previously at{" "}
                <Link href="https://www.sentry.io/" isExternal color="whiteAlpha.800" _hover={{ color: "white" }} className="bio-link">
                  sentry.io
                </Link>
                . if i&apos;m not coding, i&apos;m probably{" "}
                <Link href="https://xkcd.com/189/" isExternal color="whiteAlpha.800" _hover={{ color: "white" }} className="bio-link">
                  running
                </Link>
                .
              </Text>
            </motion.div>

            <motion.div variants={fade}>
              <HStack spacing={5}>
                {links.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    isExternal
                    color="whiteAlpha.400"
                    _hover={{ color: "white", transform: "translateY(-1px)" }}
                    transition="all 0.2s ease"
                    aria-label={link.label}
                  >
                    <link.icon size={18} />
                  </Link>
                ))}
              </HStack>
            </motion.div>
          </VStack>
        </motion.div>
      </Flex>
  );
}
