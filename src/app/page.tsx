'use client'

import React, { useEffect, useState } from 'react'
import { Button, Center, Flex, Heading, HStack, Link, VStack, Text } from '@chakra-ui/react'
import { FaEnvelope, FaGithub, FaLinkedin, FaStrava } from 'react-icons/fa'

export default function App() {
  const [theme, setTheme] = useState<string | null>(null);

  useEffect(() => {
    let theme = localStorage.getItem('theme') || 'light';
    setTheme(theme);
  }, []);

  if (!theme) {
    return null; // `theme` is null in the first render
  }

  return (
    <Center h="100vh">
      <VStack spacing="6">
        <Flex alignItems="center" flexDirection="column">
          <Text fontSize="5xl" lineHeight="1" mb="2">🐙</Text>
          <Heading as="h1" size="3xl" textAlign="center" lineHeight="1.2">
            raj joshi
          </Heading>
        </Flex>
        <Text fontSize="xl" textAlign="center">
          hello 👋! i am currently a swe at <Link href="https://www.sentry.io/" isExternal>sentry.io</Link>.
        </Text>
        <HStack spacing="4" flexWrap="wrap" justifyContent="center">
          <Link href="mailto: rajjoshi.0222@gmail.com" isExternal>
            <Button leftIcon={<FaEnvelope />} variant="outline">
              Email
            </Button>
          </Link>
          <Link href="https://www.github.com/iamrajjoshi/" isExternal>
            <Button leftIcon={<FaGithub />} variant="outline">
              GitHub
            </Button>
          </Link>
          <Link href="https://www.linkedin.com/in/rajjoshi-/" isExternal>
            <Button leftIcon={<FaLinkedin />} variant="outline">
              LinkedIn
            </Button>
          </Link>
          <Link href="https://www.strava.com/athletes/rajjoshi" isExternal>
            <Button leftIcon={<FaStrava />} variant="outline">
              Strava
          </Button>
          </Link>
        </HStack>
      </VStack>
    </Center>
  )
}