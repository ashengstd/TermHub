import { Box } from '@chakra-ui/react'

import { useColorMode } from '@/hooks/useColorMode'
import { useSlot } from '@/templates/hooks'

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { colorMode } = useColorMode()
  const Navbar = useSlot('navbar')

  return (
    <Box
      className={colorMode === 'dark' ? 'dark-theme' : ''}
      minH="100vh"
      overflowX="hidden"
      w="full"
    >
      <Box as={Navbar} />
      <Box px={[3, 4, 6]} w="full">
        {children}
      </Box>
    </Box>
  )
}

export default Layout
