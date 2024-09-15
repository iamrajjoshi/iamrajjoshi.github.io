'use client'

import { useEffect } from 'react'

import { CacheProvider } from '@chakra-ui/next-js'
import { ChakraProvider, useColorMode} from '@chakra-ui/react'
import theme from './theme'

export function Providers({ 
    children 
  }:  { 
  children: React.ReactNode 
  }) {

  return (
    <CacheProvider>
      <ChakraProvider theme={theme}>
        {children}
      </ChakraProvider>
    </CacheProvider>
  )
}