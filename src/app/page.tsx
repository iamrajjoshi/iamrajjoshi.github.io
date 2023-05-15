'use client'

import { Box, Button, Center, Heading, HStack, Link, VStack} from '@chakra-ui/react'
import { FaEnvelope, FaGithub, FaLinkedin, FaFileAlt } from 'react-icons/fa'

import ColorModeSwitch from '@/components/ColorModeSwitch'

export default function App() {
  return (
    <Center h="100vh">
      <Box position="fixed" top="4" right="4">
        <ColorModeSwitch />
      </Box>
      <VStack spacing="4">
      <Heading as="h1" size="4xl" mb="4">
        Hi, I am Raj!
      </Heading>  
      <HStack spacing="4">
        <Link href="mailto: rajj3@illinois.edu" isExternal>
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
        <Link href="#" isExternal>
          <Button leftIcon={<FaFileAlt />} variant="outline" isDisabled={true}>
            Resume
          </Button>
        </Link>
      </HStack>
      </VStack>
    </Center>
  )
}