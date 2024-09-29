'use client'

import React from 'react'
import { Button, Center, Flex, Heading, HStack, Link, VStack, Text } from '@chakra-ui/react'
import { FaEnvelope, FaGithub, FaLinkedin, FaStrava, FaXTwitter, FaBlogger, FaCalendar } from 'react-icons/fa6'

export default function App() {
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
          👋 hello! i am currently a swe at <Link href="https://www.sentry.io/" isExternal>sentry.io</Link>.
          if i am not coding, i am probably <Link href="https://xkcd.com/189/" isExternal>running</Link>.
        </Text>
        <HStack spacing="4" flexWrap="wrap" justifyContent="center">
          <Link href="mailto: raj@rajjoshi.me" isExternal>
            <Button leftIcon={<FaEnvelope />} variant="outline">
              Email
            </Button>
          </Link>
          <Link href="https://blog.rajjoshi.me" isExternal>
            <Button leftIcon={<FaBlogger />} variant="outline">
              Blog
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
          <Link href="https://x.com/rajjoshi_22" isExternal>
            <Button leftIcon={<FaXTwitter />} variant="outline">
              X
            </Button>
          </Link>
          <Link href="https://calendly.com/iamrajjoshi/coffee-chat" isExternal>
            <Button leftIcon={<FaCalendar />} variant="outline">
              Coffee Chat
            </Button>
          </Link>
        </HStack>
      </VStack>
    </Center>
  )
}