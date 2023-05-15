'use client'

import { useEffect } from 'react'

import { CacheProvider } from '@chakra-ui/next-js'
import { ChakraProvider, useColorMode} from '@chakra-ui/react'

export function Providers({ 
    children 
  }:  { 
  children: React.ReactNode 
  }) {

  return (
    <CacheProvider>
      <ChakraProvider>
        {children}
      </ChakraProvider>
    </CacheProvider>
  )
}