import { Box, Center, Flex, HStack, Text, VStack } from '@chakra-ui/react'
import { keyframes } from '@emotion/react'
import { Link, useRouter } from '@tanstack/react-router'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useThemeConfig } from '@/config/theme'
import { useColorMode } from '@/hooks/useColorMode'
import { useLocalizedData } from '@/hooks/useLocalizedData'

import { MotionHover } from './animations/MotionList'

const termFadeIn = keyframes`
  from { opacity: 0; transform: translateY(5px); }
  to   { opacity: 1; transform: translateY(0); }
`

const scanlineAnim = keyframes`
  0% { transform: translateY(0); }
  100% { transform: translateY(100vh); }
`

const flickerAnim = keyframes`
  0% { opacity: 0.97; }
  5% { opacity: 0.95; }
  10% { opacity: 0.9; }
  15% { opacity: 0.95; }
  30% { opacity: 0.98; }
  45% { opacity: 0.93; }
  50% { opacity: 0.97; }
  65% { opacity: 0.94; }
  80% { opacity: 0.98; }
  100% { opacity: 0.99; }
`

const TYPING_SPEED = 20
const LOG_SPEED = 15

const ASCII_404 = `
  _  _    ___   _  _
 | || |  / _ \\ | || |
 | || |_| | | || || |_
 |__   _| |_| ||__   _|
    |_|  \\___/    |_|
`

const NotFound: React.FC = () => {
  const { t } = useTranslation()
  const { colorMode } = useColorMode()
  const isDark = colorMode === 'dark'
  const { terminalPalette } = useThemeConfig()
  const tc = terminalPalette.colors(isDark)
  const { siteOwner } = useLocalizedData()
  const router = useRouter()

  const username = siteOwner.terminalUsername
  const prompt = `[${username}@portfolio ~]$`

  const [commandText, setCommandText] = useState('')
  const [showLogs, setShowLogs] = useState(false)
  const [logs, setLogs] = useState<string[]>([])
  const [showFinalResponse, setShowFinalResponse] = useState(false)
  const [cursorOn, setCursorOn] = useState(true)

  const command = t('notFound.command', 'curl -i https://404.com')

  const connectionLogs = useMemo(
    () => [
      '*   Trying 127.0.0.1:443...',
      '* Connected to 404.com (127.0.0.1) port 443 (#0)',
      '* ALPN: offers h2, http/1.1',
      '* TLSv1.3 handshake initiated...',
      '* SSL connection using TLSv1.3 / AEAD-CHACHA20-POLY1305',
      '> GET / HTTP/2',
      '> Host: 404.com',
      '> user-agent: ascka-client/1.0.0',
      '* HTTP/2 404 Not Found',
    ],
    [],
  )

  // Cursor blink
  useEffect(() => {
    const id = setInterval(() => setCursorOn((v) => !v), 530)
    return () => clearInterval(id)
  }, [])

  // Stage 1: Type command
  useEffect(() => {
    if (commandText.length < command.length) {
      const timeout = setTimeout(() => {
        setCommandText(command.slice(0, commandText.length + 1))
      }, TYPING_SPEED)
      return () => clearTimeout(timeout)
    } else if (!showLogs) {
      const timeout = setTimeout(() => setShowLogs(true), 200)
      return () => clearTimeout(timeout)
    }
  }, [commandText, command, showLogs])

  // Stage 2: Show logs
  useEffect(() => {
    if (showLogs && logs.length < connectionLogs.length) {
      const timeout = setTimeout(
        () => {
          setLogs((prev) => [...prev, connectionLogs[prev.length]])
        },
        LOG_SPEED + Math.random() * 40,
      )
      return () => clearTimeout(timeout)
    } else if (showLogs && logs.length === connectionLogs.length && !showFinalResponse) {
      const timeout = setTimeout(() => setShowFinalResponse(true), 300)
      return () => clearTimeout(timeout)
    }
  }, [showLogs, logs, connectionLogs, showFinalResponse])

  const currentDate = useMemo(() => new Date().toUTCString(), [])

  const fadeIn = (delay: number) => ({
    animation: `${termFadeIn} 0.3s ease ${delay.toString()}s forwards`,
    opacity: 0,
  })

  return (
    <Center minH="calc(100vh - 160px)" p={4} position="relative">
      {/* Background Glow */}
      <Box
        bg={tc.highlight}
        borderRadius="full"
        filter="blur(120px)"
        h="300px"
        left="50%"
        opacity={isDark ? 0.15 : 0.05}
        pointerEvents="none"
        position="absolute"
        top="45%"
        transform="translate(-50%, -50%)"
        w="400px"
        z-index={-1}
      />

      <VStack gap={10} maxW="640px" w="full">
        <Box
          animation={`${flickerAnim} 0.15s infinite alternate`}
          bg={tc.bg}
          border={`1px solid ${tc.border}`}
          borderRadius="xl"
          boxShadow={isDark ? '0 20px 50px rgba(0,0,0,0.6)' : '0 10px 30px rgba(0,0,0,0.1)'}
          fontFamily="mono"
          fontSize={['xs', 'sm']}
          overflow="hidden"
          position="relative"
          w="full"
        >
          {/* CRT Overlay */}
          <Box
            background="linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.1) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.02), rgba(0, 255, 0, 0.01), rgba(0, 0, 255, 0.02))"
            backgroundSize="100% 3px, 2px 100%"
            inset={0}
            pointerEvents="none"
            position="absolute"
            z-index={10}
          />
          <Box
            animation={`${scanlineAnim} 8s linear infinite`}
            background="linear-gradient(to bottom, transparent 0%, rgba(32, 255, 32, 0.02) 50%, transparent 100%)"
            h="100px"
            left={0}
            pointerEvents="none"
            position="absolute"
            top={-100}
            w="full"
            z-index={11}
          />

          {/* macOS-style title bar */}
          <Flex
            align="center"
            bg={tc.header}
            borderBottom={`1px solid ${tc.border}`}
            position="relative"
            px={4}
            py={2.5}
          >
            <HStack gap={1.5}>
              <Box bg="#ff5f57" borderRadius="full" flexShrink={0} h="11px" w="11px" />
              <Box bg="#febc2e" borderRadius="full" flexShrink={0} h="11px" w="11px" />
              <Box bg="#28c840" borderRadius="full" flexShrink={0} h="11px" w="11px" />
            </HStack>
            <Text
              color={tc.secondary}
              fontSize="xs"
              left="50%"
              letterSpacing="wide"
              pointerEvents="none"
              position="absolute"
              transform="translateX(-50%)"
            >
              {username} — 404.sh
            </Text>
          </Flex>

          {/* Terminal body */}
          <Box lineHeight="tall" px={[4, 5, 6]} py={[4, 5]}>
            <HStack align="center" flexWrap="wrap" gap={2} mb={showLogs ? 2 : 0}>
              <Text color={tc.prompt} flexShrink={0}>
                {prompt}
              </Text>
              <Text color={tc.text} whiteSpace="pre">
                {commandText}
              </Text>
              {!showLogs && (
                <Box
                  bg={tc.text}
                  borderRadius="1px"
                  display="inline-block"
                  h="1.15em"
                  ml="1px"
                  opacity={cursorOn ? 0.85 : 0}
                  transition="opacity 0.08s"
                  w="0.58em"
                />
              )}
            </HStack>

            {showLogs && (
              <Box mb={4}>
                {logs.map((log, i) => (
                  <Text color={tc.muted} fontSize="xs" key={i}>
                    {log}
                  </Text>
                ))}
              </Box>
            )}

            {showFinalResponse && (
              <Box fontSize="xs">
                <Text color={tc.secondary} css={fadeIn(0.05)}>
                  HTTP/1.1 404 Not Found
                </Text>
                <Text color={tc.secondary} css={fadeIn(0.1)}>
                  {t('notFound.date', 'Date:')} {currentDate}
                </Text>
                <Text color={tc.secondary} css={fadeIn(0.15)}>
                  {t('notFound.contentType', 'Content-Type: text/plain')}
                </Text>
                <Box h={4} />

                {/* ASCII Art 404 */}
                <Box color={tc.error} css={fadeIn(0.3)} fontFamily="monospace" whiteSpace="pre">
                  {ASCII_404}
                </Box>

                <Box h={4} />
                <Text color={tc.error} css={fadeIn(0.5)} fontWeight="bold">
                  {t('notFound.errorMessage', 'Error: 404 Page Not Found')}
                </Text>
                <Text color={tc.muted} css={fadeIn(0.7)} mt={2}>
                  {t('notFound.description', 'The requested URL was not found on this server.')}
                </Text>

                <HStack mt={6} gap={4}>
                  <Text color={tc.prompt} flexShrink={0}>
                    {prompt}
                  </Text>
                  <Box
                    bg={tc.text}
                    borderRadius="1px"
                    display="inline-block"
                    h="1.15em"
                    ml="1px"
                    opacity={cursorOn ? 0.85 : 0}
                    transition="opacity 0.08s"
                    w="0.58em"
                  />
                </HStack>
              </Box>
            )}
          </Box>
        </Box>

        {/* Improved Buttons */}
        <HStack gap={6} opacity={showFinalResponse ? 1 : 0} transition="opacity 0.5s ease 0.6s">
          <MotionHover>
            <Link style={{ textDecoration: 'none' }} to="/">
              <HStack
                _hover={{
                  borderColor: tc.highlight,
                  color: tc.highlight,
                  transform: 'translateY(-2px)',
                }}
                bg={tc.bg}
                border="1px solid"
                borderColor={tc.border}
                borderRadius="md"
                color={tc.secondary}
                fontFamily="mono"
                fontSize="sm"
                gap={2}
                px={4}
                py={2}
                transition="all 0.2s"
              >
                <Text color={tc.prompt} fontWeight="bold">
                  ~
                </Text>
                <Text>{t('notFound.returnHome', 'cd ~')}</Text>
              </HStack>
            </Link>
          </MotionHover>

          <MotionHover>
            <Box
              _hover={{
                borderColor: tc.highlight,
                color: tc.highlight,
                cursor: 'pointer',
                transform: 'translateY(-2px)',
              }}
              bg={tc.bg}
              border="1px solid"
              borderColor={tc.border}
              borderRadius="md"
              color={tc.secondary}
              fontFamily="mono"
              fontSize="sm"
              onClick={() => router.history.back()}
              px={4}
              py={2}
              transition="all 0.2s"
            >
              <HStack gap={2}>
                <Text color={tc.muted} fontWeight="bold">
                  ←
                </Text>
                <Text>{t('notFound.goBack', 'history -1')}</Text>
              </HStack>
            </Box>
          </MotionHover>
        </HStack>
      </VStack>
    </Center>
  )
}

export default NotFound
