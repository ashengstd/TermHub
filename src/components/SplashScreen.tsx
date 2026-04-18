import { Box, Center, Text, VStack } from '@chakra-ui/react'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'

const BOOT_LOGS = [
  '[  0.000000] Initializing Ascka Kernel...',
  '[  0.082431] Checking Hardware: CPU @ 5.0GHz... [ OK ]',
  '[  0.151923] Detecting Memory... 16GB Found [ OK ]',
  '[  0.212891] Loading Ascka Core Subsystems...',
  '[  0.282182] Initializing React-Chakra-UI layer... [ OK ]',
  '[  0.352318] Checking I18n Locales... [ zh, en ]',
  '[  0.422932] Mounting Virtual File System... [ OK ]',
  '[  0.498124] Starting Network Stack... [ OK ]',
  '[  0.552831] Ascka Protocol: Initialized',
  '[  0.612841] User Authenticated: Ascka',
  '[  0.682912] System Ready. Starting UI...',
]

const ASCII_LOGO = `
   _   ___  ____ _  __ _   
  / _\\ / __|/ ___| |/ // _\\ 
 / _ \\\\__ \\ |   | ' // _ \\
/_/ \\_\\___/\\____|_|\\_\\/_/ \\_\\
`

interface SplashScreenProps {
  onComplete: () => void
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [currentLogIndex, setCurrentLogIndex] = useState(0)
  const [showLogo, setShowLogo] = useState(false)
  const [isExiting, setIsExiting] = useState(false)

  // Rapid log printing
  useEffect(() => {
    if (currentLogIndex < BOOT_LOGS.length) {
      const delay = Math.random() * 80 + 20
      const timeout = setTimeout(() => {
        setCurrentLogIndex((prev) => prev + 1)
      }, delay)
      return () => clearTimeout(timeout)
    } else {
      // Show logo after logs finish
      const timeout = setTimeout(() => setShowLogo(true), 200)
      return () => clearTimeout(timeout)
    }
  }, [currentLogIndex])

  // Finish splash screen
  useEffect(() => {
    if (showLogo) {
      const timeout = setTimeout(() => {
        setIsExiting(true)
        setTimeout(onComplete, 800) // Match exit animation duration
      }, 1500)
      return () => clearTimeout(timeout)
    }
  }, [showLogo, onComplete])

  const visibleLogs = useMemo(() => BOOT_LOGS.slice(0, currentLogIndex), [currentLogIndex])

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          animate={{ opacity: 1 }}
          exit={{ filter: 'blur(20px)', opacity: 0, scale: 1.1 }}
          initial={{ opacity: 1 }}
          style={{
            background: '#000',
            bottom: 0,
            left: 0,
            position: 'fixed',
            right: 0,
            top: 0,
            zIndex: 9999,
          }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
        >
          <Center h="full" p={6}>
            <VStack align="start" gap={0} maxW="800px" w="full">
              {/* Boot Logs */}
              <VStack align="start" gap={1} mb={6} w="full">
                {visibleLogs.map((log, i) => (
                  <Text
                    color="#00FF00"
                    fontFamily="mono"
                    fontSize={['2xs', 'xs', 'sm']}
                    key={i}
                    opacity={0.9}
                  >
                    {log}
                  </Text>
                ))}
              </VStack>

              {/* Logo Reveal */}
              <AnimatePresence>
                {showLogo && (
                  <motion.div
                    animate={{ opacity: 1, y: 0 }}
                    initial={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Box
                      color="cyan.400"
                      fontFamily="mono"
                      fontSize={['2xs', 'xs', 'sm']}
                      lineHeight="1.1"
                      whiteSpace="pre"
                    >
                      {ASCII_LOGO}
                    </Box>
                    <Text color="cyan.200" fontFamily="mono" fontSize="xs" mt={4} opacity={0.8}>
                      Welcome to Ascka Personal System v1.0
                    </Text>
                  </motion.div>
                )}
              </AnimatePresence>
            </VStack>
          </Center>

          {/* CRT Scanline Effect for Splash */}
          <Box
            background="linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.1) 50%)"
            backgroundSize="100% 4px"
            inset={0}
            pointerEvents="none"
            position="absolute"
            zIndex={10000}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default SplashScreen
