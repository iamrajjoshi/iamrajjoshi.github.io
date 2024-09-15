'use client'

import { ColorModeScript } from '@chakra-ui/react'

import { Providers } from "./providers";

import theme from '@/app/theme'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <title>
          Raj Joshi
        </title>
        <meta
          name="description"
          content="Raj Joshi's personal website."
        />
      </head>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
