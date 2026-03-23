import { extendTheme, type ThemeConfig } from '@chakra-ui/react'

const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
}

const colors = {
  brand: {
    50: '#ecfdf5',
    100: '#d1fae5',
    200: '#5eead4',
    300: '#2dd4bf',
    400: '#14b8a6',
    500: '#0d9488',
    600: '#0f766e',
    700: '#115e59',
    800: '#134e4a',
    900: '#1a3a3a',
  },
  background: {
    dark: '#0a0a0f',
  },
}

const fonts = {
  heading: 'var(--font-poppins), "Poppins", sans-serif',
  body: 'var(--font-inter), "Inter", sans-serif',
}

const styles = {
  global: {
    body: {
      bg: 'background.dark',
      color: 'whiteAlpha.900',
    },
  },
}

const components = {
  Heading: {
    baseStyle: {
      fontWeight: '700',
      letterSpacing: '-0.03em',
    },
  },
  Link: {
    baseStyle: {
      color: 'whiteAlpha.500',
      transition: 'color 0.2s ease',
      _hover: {
        textDecoration: 'none',
        color: 'whiteAlpha.900',
      },
    },
  },
}

const theme = extendTheme({
  config,
  colors,
  fonts,
  styles,
  components,
})

export default theme
