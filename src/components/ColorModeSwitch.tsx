import { useColorMode, IconButton } from '@chakra-ui/react';
import { FaSun, FaMoon } from 'react-icons/fa';

export default function ColorModeSwitch() {
  const { colorMode, toggleColorMode } = useColorMode();
  const isDark = colorMode === 'dark';

  return (
    <IconButton
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      icon={isDark ? <FaSun /> : <FaMoon />}
      onClick={toggleColorMode}
      variant="ghost"
      size="lg"
      rounded="full"
    />
  );
}
