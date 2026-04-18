import {
  Badge,
  Box,
  Container,
  Flex,
  Grid,
  GridItem,
  Heading,
  HStack,
  Image,
  Link,
  Separator,
  Text,
  VStack,
} from '@chakra-ui/react'
import { keyframes } from '@emotion/react'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useThemeConfig } from '@/config/theme'
import { useColorMode, useColorModeValue } from '@/hooks/useColorMode'
import { useLocalizedData } from '@/hooks/useLocalizedData'
import { heroSocialIcons } from '@/site.config'
import { withBase } from '@/utils/asset'

import { MotionBox, MotionHover } from './animations/MotionList'
import DynamicIcon from './DynamicIcon'
import BioSection from './sections/BioSection'
import JourneySection from './sections/JourneySection'
import MentorshipSection from './sections/MentorshipSection'

/* ── Typewriter Terminal ──────────────────────────────────── */

const termFadeIn = keyframes`
  from { opacity: 0; transform: translateY(5px); }
  to   { opacity: 1; transform: translateY(0); }
`

const TYPING_SPEED = 65
const DELETING_SPEED = 32
const PAUSE_AFTER_TYPE = 2200
const PAUSE_AFTER_DELETE = 450

type TypePhase = 'deleting' | 'pausing' | 'typing' | 'waiting'

const TerminalTypewriter: React.FC = () => {
  const { colorMode } = useColorMode()
  const isDark = colorMode === 'dark'
  const { terminalPalette } = useThemeConfig()
  const tc = terminalPalette.colors(isDark)

  const { about, siteOwner } = useLocalizedData()
  const phrases = useMemo(() => siteOwner.rotatingSubtitles, [siteOwner.rotatingSubtitles])
  const username = siteOwner.terminalUsername
  const fullName = siteOwner.name.full

  const paragraphs = about.bio
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean)

  const [displayText, setDisplayText] = useState('')
  const [phraseIndex, setPhraseIndex] = useState(0)
  const [phase, setPhase] = useState<TypePhase>('typing')
  const [cursorOn, setCursorOn] = useState(true)

  // Cursor blink — always blinks, just less noticeable while typing
  useEffect(() => {
    const id = setInterval(() => setCursorOn((v) => !v), 530)
    return () => clearInterval(id)
  }, [])

  // State machine
  useEffect(() => {
    if (!phrases.length) return
    const current = phrases[phraseIndex]

    if (phase === 'typing') {
      if (displayText.length < current.length) {
        const t = setTimeout(
          () => {
            setDisplayText(current.slice(0, displayText.length + 1))
          },
          TYPING_SPEED + Math.random() * 25,
        ) // slight jitter feels natural
        return () => clearTimeout(t)
      } else {
        const t = setTimeout(() => setPhase('pausing'), 80)
        return () => clearTimeout(t)
      }
    }

    if (phase === 'pausing') {
      const t = setTimeout(() => setPhase('deleting'), PAUSE_AFTER_TYPE)
      return () => clearTimeout(t)
    }

    if (phase === 'deleting') {
      if (displayText.length > 0) {
        const t = setTimeout(() => {
          setDisplayText((prev) => prev.slice(0, -1))
        }, DELETING_SPEED)
        return () => clearTimeout(t)
      } else {
        const t = setTimeout(() => {
          setPhraseIndex((i) => (i + 1) % phrases.length)
          setPhase('typing')
        }, PAUSE_AFTER_DELETE)
        return () => clearTimeout(t)
      }
    }
  }, [displayText, phase, phraseIndex, phrases])

  const prompt = `[${username}@portfolio ~]$`

  // Static history lines shown above the animated line
  const historyLines: { cmd: string; output?: string; prompt: string }[] = [
    {
      cmd: 'whoami',
      output: fullName,
      prompt,
    },
  ]

  const fadeIn = (delay: number) => ({
    animation: `${termFadeIn} 0.4s ease ${delay.toString()}s forwards`,
    opacity: 0,
  })

  return (
    <Box
      bg={tc.bg}
      border={`1px solid ${tc.border}`}
      borderRadius="xl"
      boxShadow={isDark ? '0 8px 32px rgba(0,0,0,0.4)' : '0 4px 24px rgba(0,0,0,0.08)'}
      fontFamily="mono"
      fontSize={['xs', 'sm']}
      overflow="hidden"
    >
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
          {username} — zsh
        </Text>
      </Flex>

      {/* Terminal body */}
      <Box lineHeight="tall" px={[4, 5, 6]} py={[4, 5]}>
        {/* Login hint */}
        <Text color={tc.muted} fontSize="xs" mb={4}>
          Last login: {new Date().toDateString()} on ttys001
        </Text>

        {/* Static history */}
        {historyLines.map((line, i) => (
          <Box key={i} mb={3}>
            <HStack flexWrap="wrap" gap={2}>
              <Text color={tc.prompt} flexShrink={0}>
                {line.prompt}
              </Text>
              <Text color={tc.command}>{line.cmd}</Text>
            </HStack>
            {line.output && (
              <Text color={tc.text} mt={0.5} pl={0}>
                {line.output}
              </Text>
            )}
          </Box>
        ))}

        {/* cat profile.md */}
        <Box mb={5}>
          <HStack flexWrap="wrap" gap={2} mb={2}>
            <Text color={tc.prompt} flexShrink={0}>
              {prompt}
            </Text>
            <Text color={tc.command}>cat</Text>
            <Text color={tc.param}>profile.md</Text>
          </HStack>

          <Box fontSize="xs" pl={1}>
            {/* Comment header — staggered */}
            <Text color={tc.highlight} css={fadeIn(0.05)} fontWeight="semibold" mb={0.5}>
              {'# ── '}
              {siteOwner.name.full}
              {' · M.S. Student @ NUAA ──────────────'}
            </Text>
            {about.researchTitle && (
              <Text color={tc.secondary} css={fadeIn(0.18)} mb={3}>
                {`# ${about.researchTitle}`}
              </Text>
            )}

            {/* Bio paragraphs — each fades in with increasing delay */}
            <VStack align="start" gap={2}>
              {paragraphs.map((para, i) => (
                <Text color={tc.text} css={fadeIn(0.35 + i * 0.22)} key={i} lineHeight="tall">
                  {para}
                </Text>
              ))}
            </VStack>
          </Box>
        </Box>

        {/* Live typewriter line */}
        <Box>
          <HStack flexWrap="wrap" gap={2}>
            <Text color={tc.prompt} flexShrink={0}>
              {prompt}
            </Text>
            <Text color={tc.command}>echo</Text>
            <Text color={tc.param}>$INTRO</Text>
          </HStack>

          {/* Output line with cursor */}
          <HStack align="center" gap={0} minH="1.5em" mt={0.5}>
            <Text color={tc.text} whiteSpace="pre">
              {displayText}
            </Text>
            {/* Block cursor */}
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
      </Box>
    </Box>
  )
}

/* ── Profile Sidebar ──────────────────────────────────────── */

const ProfileSidebar: React.FC = () => {
  const { siteConfig, siteOwner } = useLocalizedData()
  const { t } = useTranslation()

  const cardBg = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const textColor = useColorModeValue('gray.600', 'gray.400')
  const headingColor = useColorModeValue('gray.800', 'gray.100')
  const promptColor = 'yellow.400'
  const tagBg = useColorModeValue('gray.100', 'gray.700')
  const tagColor = useColorModeValue('gray.600', 'gray.300')
  const dividerColor = useColorModeValue('gray.100', 'gray.700')
  const headerBg = useColorModeValue('gray.50', 'gray.900')
  const avatarBorderColor = useColorModeValue('gray.200', 'gray.600')
  const skillIconColor = useColorModeValue('gray.500', 'gray.400')

  type SkillItem = string | { icon?: string; name: string }
  const skills = siteOwner.skills as SkillItem[]
  const getName = (s: SkillItem) => (typeof s === 'string' ? s : s.name)
  const getIcon = (s: SkillItem) => (typeof s === 'string' ? undefined : s.icon)

  return (
    <Box
      bg={cardBg}
      border="1px solid"
      borderColor={borderColor}
      borderRadius="xl"
      overflow="hidden"
      position={['static', 'static', 'sticky']}
      top="80px"
    >
      {/* Terminal title bar */}
      <Flex
        align="center"
        bg={headerBg}
        borderBottom="1px solid"
        borderColor={borderColor}
        gap={2}
        px={4}
        py={2.5}
      >
        <HStack gap={1.5}>
          <Box bg="red.400" borderRadius="full" h="10px" w="10px" />
          <Box bg="yellow.400" borderRadius="full" h="10px" w="10px" />
          <Box bg="green.400" borderRadius="full" h="10px" w="10px" />
        </HStack>
        <Text color={textColor} fontFamily="mono" fontSize="xs" ml={2}>
          whoami
        </Text>
      </Flex>

      <VStack align="stretch" gap={0}>
        {/* Avatar + Name */}
        <VStack align="center" gap={3} pb={4} pt={6} px={5}>
          <MotionHover>
            <Image
              alt={siteOwner.name.full}
              border="2px solid"
              borderColor={avatarBorderColor}
              borderRadius="xl"
              boxSize={['100px', '120px', '128px']}
              objectFit="cover"
              src={withBase(`images/${siteConfig.avatar}`)}
            />
          </MotionHover>
          <VStack align="center" gap={1}>
            <HStack fontFamily="mono" fontSize="sm" gap={1}>
              <Text color={promptColor} fontWeight="bold">
                ~
              </Text>
              <Text color="cyan.400" fontWeight="semibold">
                {siteOwner.name.full}
              </Text>
            </HStack>
            <Text color={textColor} fontSize="xs" lineHeight="short" textAlign="center">
              {siteConfig.tagline}
            </Text>
          </VStack>
        </VStack>

        <Separator borderColor={dividerColor} />

        {/* Meta info */}
        <VStack align="stretch" gap={2.5} px={5} py={4}>
          {siteOwner.contact.location && (
            <HStack gap={2.5}>
              <DynamicIcon boxSize={3} color="cyan.400" name="FaMapMarkerAlt" />
              <Text color={textColor} fontFamily="mono" fontSize="xs">
                {siteOwner.contact.location}
              </Text>
            </HStack>
          )}
          {siteOwner.contact.email && (
            <HStack gap={2.5}>
              <DynamicIcon boxSize={3} color="cyan.400" name="FaEnvelope" />
              <MotionHover>
                <Link
                  _hover={{ color: 'cyan.400', textDecoration: 'none' }}
                  color={textColor}
                  fontFamily="mono"
                  fontSize="xs"
                  href={`mailto:${siteOwner.contact.email}`}
                  overflow="hidden"
                  textOverflow="ellipsis"
                  whiteSpace="nowrap"
                >
                  {siteOwner.contact.email}
                </Link>
              </MotionHover>
            </HStack>
          )}
          {siteOwner.social.github && (
            <HStack gap={2.5}>
              <DynamicIcon boxSize={3} color="cyan.400" name="FaGithub" />
              <MotionHover>
                <Link
                  _hover={{ color: 'cyan.400', textDecoration: 'none' }}
                  color={textColor}
                  fontFamily="mono"
                  fontSize="xs"
                  href={siteOwner.social.github}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {siteOwner.social.github.replace('https://github.com/', '@')}
                </Link>
              </MotionHover>
            </HStack>
          )}
        </VStack>

        <Separator borderColor={dividerColor} />

        {/* Social links */}
        {heroSocialIcons.length > 0 && (
          <>
            <HStack flexWrap="wrap" gap={2} px={5} py={3}>
              {heroSocialIcons.map((item) => (
                <MotionHover key={item.label}>
                  <Link
                    _hover={{ textDecoration: 'none' }}
                    href={item.href}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <HStack
                      _hover={{
                        borderColor: item.color,
                        color: item.color,
                        transform: 'translateY(-1px)',
                      }}
                      border="1px solid"
                      borderColor={borderColor}
                      borderRadius="md"
                      color={textColor}
                      fontFamily="mono"
                      fontSize="xs"
                      gap={1.5}
                      px={2.5}
                      py={1.5}
                      transition="all 0.2s"
                    >
                      <DynamicIcon boxSize={3} name={item.icon} />
                      <Text>{item.label}</Text>
                    </HStack>
                  </Link>
                </MotionHover>
              ))}
            </HStack>
            <Separator borderColor={dividerColor} />
          </>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <Box px={5} py={4}>
            <HStack gap={2} mb={3}>
              <Box bg="cyan.400" borderRadius="full" h="2px" w="12px" />
              <Text
                color={headingColor}
                fontFamily="mono"
                fontSize="xs"
                fontWeight="semibold"
                letterSpacing="wider"
                textTransform="uppercase"
              >
                {t('about.skills', 'Skills')}
              </Text>
            </HStack>
            <Flex flexWrap="wrap" gap={1.5}>
              {skills.map((skill) => (
                <HStack
                  bg={tagBg}
                  borderRadius="sm"
                  color={tagColor}
                  fontFamily="mono"
                  fontSize="2xs"
                  gap={1}
                  key={getName(skill)}
                  px={2}
                  py={0.5}
                >
                  {getIcon(skill) && (
                    <DynamicIcon boxSize={2.5} color={skillIconColor} name={getIcon(skill)} />
                  )}
                  <Text>{getName(skill)}</Text>
                </HStack>
              ))}
            </Flex>
          </Box>
        )}
      </VStack>
    </Box>
  )
}

/* ── Page Header ──────────────────────────────────────────── */

const PageHeader: React.FC = () => {
  const { t } = useTranslation()
  const { siteOwner } = useLocalizedData()
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const textColor = useColorModeValue('gray.500', 'gray.500')
  const cmdColor = useColorModeValue('gray.700', 'gray.200')

  return (
    <Box borderBottom="1px solid" borderColor={borderColor} mb={2} pb={6}>
      <HStack fontFamily="mono" fontSize={['sm', 'md']} gap={2} mb={2}>
        <Text color="yellow.400" fontWeight="bold">
          $
        </Text>
        <Text color="cyan.400">cat</Text>
        <Text color={cmdColor}>about.md</Text>
        <Box
          animation="blink 1s step-end infinite"
          as="span"
          bg="cyan.400"
          css={{
            '@keyframes blink': {
              '0%, 100%': { opacity: 1 },
              '50%': { opacity: 0 },
            },
          }}
          display="inline-block"
          h="1em"
          w="2px"
        />
      </HStack>
      <HStack gap={3} mt={3}>
        <Box bg="cyan.400" borderRadius="full" h="3px" w="32px" />
        <Heading fontWeight="bold" size={['md', 'lg']}>
          {t('nav.about', 'About')}
        </Heading>
        <Badge colorPalette="cyan" fontFamily="mono" fontSize="2xs" px={2} variant="subtle">
          {siteOwner.name.full}
        </Badge>
      </HStack>
      <Text color={textColor} fontFamily="mono" fontSize="xs" mt={1}>
        # {t('about.aboutDescription', 'Personal background, experience & skills')}
      </Text>
    </Box>
  )
}

/* ── About Page ───────────────────────────────────────────── */

const AboutPage: React.FC = () => {
  return (
    <Box py={[4, 6, 8]} w="full">
      <Container maxW="7xl" px={[3, 4, 8]}>
        <PageHeader />

        <Grid
          alignItems="start"
          gap={[6, 6, 8]}
          mt={6}
          templateColumns={['1fr', '1fr', '280px 1fr', '300px 1fr']}
        >
          {/* Sidebar */}
          <GridItem>
            <MotionBox delay={0.1}>
              <ProfileSidebar />
            </MotionBox>
          </GridItem>

          {/* Main content */}
          <GridItem>
            <MotionBox delay={0.2}>
              <VStack align="stretch" gap={[6, 7, 8]}>
                {/* Typewriter terminal — self intro */}
                <TerminalTypewriter />

                {/* Bio */}
                <BioSection />

                {/* Journey / Timeline */}
                <JourneySection />

                {/* Tech Stack */}
                <MentorshipSection />
              </VStack>
            </MotionBox>
          </GridItem>
        </Grid>
      </Container>
    </Box>
  )
}

export default AboutPage
