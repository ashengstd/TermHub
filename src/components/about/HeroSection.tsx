import {
  Box,
  Container,
  Flex,
  Heading,
  HStack,
  Image,
  Link,
  SimpleGrid,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

import { useColorMode, useColorModeValue } from '@/hooks/useColorMode'
import { useLocalizedData } from '@/hooks/useLocalizedData'
import { heroSocialIcons } from '@/site.config'
import { withBase } from '@/utils/asset'

import DynamicIcon from '../DynamicIcon'

const MotionBox = motion(Box)
const MotionText = motion(Text)

interface EducationItem {
  course: string
  institution: string
  year: string
}

// Hero Section Component
interface HeroSectionProps {
  avatar: string
  education?: EducationItem[]
  educationLogos?: Record<string, string>
  research?: ResearchItem[]
  researchLogos?: Record<string, string>
  title: string
}

interface ResearchItem {
  advisor?: string
  emoji: string
  focus: string
  lab: string
  link: string
}

const HeroSection = ({
  avatar,
  education = [],
  educationLogos = {},
  research = [],
  researchLogos = {},
  title,
}: HeroSectionProps) => {
  const { t } = useTranslation()
  const { siteConfig, siteOwner } = useLocalizedData()
  const { colorMode } = useColorMode()
  const isDark = colorMode === 'dark'
  const headingColor = useColorModeValue('gray.800', 'white')
  const textColor = useColorModeValue('gray.600', 'gray.400')
  const bg = useColorModeValue('gray.50', 'gray.900')
  const accentBg = useColorModeValue('blue.50', 'blue.900')
  const sublineColor = useColorModeValue('gray.600', 'gray.400')
  const separatorColor = useColorModeValue('gray.200', 'gray.700')
  const socialIconColor = isDark ? 'gray.500' : 'gray.400'
  const hoverBg = isDark ? 'gray.700' : 'gray.100'

  return (
    <Box bg={bg} mt={[2, 3, 4]} py={[3, 4, 6]} w="full">
      <Container maxW={['full', 'full', '7xl']} px={[2, 4, 8]}>
        <Stack
          align="center"
          direction={['column', 'column', 'row']}
          gap={[3, 4, 6]}
          justify="space-between"
        >
          <VStack align={['center', 'center', 'flex-start']} flex="1" gap={[2, 3]}>
            <MotionText
              alignItems="center"
              animate={{ opacity: 1 }}
              as="h1"
              color={headingColor}
              css={{
                justifyContent: ['center', 'center', 'flex-start'],
              }}
              display="flex"
              flexWrap={['wrap', 'wrap', 'nowrap']}
              fontSize={['lg', 'xl', '3xl']}
              fontWeight="bold"
              gap={[1, 2]}
              initial={{ opacity: 0 }}
              lineHeight="shorter"
              mb={[1, 2, 3]}
              textAlign={['center', 'center', 'left']}
              transition={{ duration: 0.8 }}
              w="full"
            >
              <MotionText
                animate={{ opacity: 1 }}
                as="span"
                color="yellow.400"
                initial={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                $
              </MotionText>
              <MotionText
                animate={{ width: 'auto' }}
                as="span"
                display="inline-block"
                initial={{ width: 0 }}
                overflow="hidden"
                transition={{ delay: 0.1, duration: 0.5 }}
                whiteSpace="nowrap"
              >
                {t('hero.greeting')}{' '}
              </MotionText>
              <MotionText
                alignItems="center"
                animate={{ opacity: 1 }}
                as="span"
                color="cyan.400"
                display="flex"
                fontFamily="mono"
                gap={1}
                initial={{ opacity: 0 }}
                transition={{ delay: 0.6, duration: 0.2 }}
              >
                <MotionText
                  animate={{ width: 'auto' }}
                  as="span"
                  initial={{ width: 0 }}
                  overflow="hidden"
                  transition={{ delay: 0.7, duration: 0.3 }}
                  whiteSpace="nowrap"
                >
                  {siteOwner.name.display}
                </MotionText>
              </MotionText>
            </MotionText>

            <HStack
              flexWrap="wrap"
              gap={[1, 2]}
              justify={['center', 'center', 'flex-start']}
              mb={[2, 3, 4]}
              w="full"
            >
              <Text color="yellow.400" fontSize={['xs', 'sm']}>
                $
              </Text>
              <Text color={sublineColor} fontSize={['xs', 'sm']}>
                {t('hero.sometimesI')}
              </Text>
              <Box h={['18px', '20px', '24px']} overflow="hidden">
                <MotionBox
                  animate={{ y: [0, -18, -36, -54, -72, -90, 0] }}
                  transition={{
                    duration: 8,
                    ease: 'linear',
                    repeat: Infinity,
                    times: [0, 0.15, 0.3, 0.45, 0.6, 0.75, 0.9],
                  }}
                >
                  {siteOwner.rotatingSubtitles.map((text, index) => (
                    <Text
                      color="cyan.400"
                      fontFamily="mono"
                      fontSize={['xs', 'sm']}
                      fontWeight="bold"
                      h={['18px', '20px', '24px']}
                      key={index}
                    >
                      {text}
                    </Text>
                  ))}
                </MotionBox>
              </Box>
            </HStack>

            <Box borderColor={separatorColor} borderTop="1px dashed" w="full" />

            {/* Research & Education compact section */}
            {(research.length > 0 || education.length > 0) && (
              <SimpleGrid columns={[1, 1, 2]} gap={[3, 3, 4]} w="full">
                {research.length > 0 && (
                  <VStack align="start" gap={2}>
                    <Heading
                      color={textColor}
                      fontSize="2xs"
                      letterSpacing="wider"
                      size="xs"
                      textTransform="uppercase"
                    >
                      Current Research
                    </Heading>
                    {research.map((item, index) => {
                      const logo = researchLogos[item.lab]
                      return (
                        <Link
                          _hover={{ textDecoration: 'none' }}
                          href={item.link}
                          key={index}
                          rel="noopener noreferrer"
                          target="_blank"
                          w="full"
                        >
                          <HStack
                            _hover={{ bg: hoverBg }}
                            borderRadius="md"
                            gap={2.5}
                            p={2}
                            transition="all 0.2s"
                          >
                            {logo ? (
                              <Image
                                alt={item.lab}
                                borderRadius="sm"
                                flexShrink={0}
                                h="28px"
                                objectFit="contain"
                                src={logo}
                                w="28px"
                              />
                            ) : (
                              <Flex
                                align="center"
                                bg={accentBg}
                                borderRadius="sm"
                                flexShrink={0}
                                h="28px"
                                justify="center"
                                w="28px"
                              >
                                <Text fontSize="sm">{item.emoji}</Text>
                              </Flex>
                            )}
                            <VStack align="start" flex={1} gap={0}>
                              <Text
                                color={headingColor}
                                fontSize={['xs', 'sm']}
                                fontWeight="medium"
                                lineHeight="short"
                              >
                                {item.lab}
                              </Text>
                              <Text
                                color={textColor}
                                fontSize="2xs"
                                lineHeight="short"
                                overflow="hidden"
                                textOverflow="ellipsis"
                                whiteSpace="nowrap"
                              >
                                {item.advisor ? `w/ ${item.advisor}` : item.focus}
                              </Text>
                            </VStack>
                          </HStack>
                        </Link>
                      )
                    })}
                  </VStack>
                )}
                {education.length > 0 && (
                  <VStack align="start" gap={2}>
                    <Heading
                      color={textColor}
                      fontSize="2xs"
                      letterSpacing="wider"
                      size="xs"
                      textTransform="uppercase"
                    >
                      Education
                    </Heading>
                    {education.map((item, index) => {
                      const logo = educationLogos[item.institution]
                      return (
                        <HStack borderRadius="md" gap={2.5} key={index} p={2} w="full">
                          {logo ? (
                            <Image
                              alt={item.institution}
                              borderRadius="sm"
                              flexShrink={0}
                              h="28px"
                              objectFit="contain"
                              src={logo}
                              w="28px"
                            />
                          ) : (
                            <Flex
                              align="center"
                              bg={accentBg}
                              borderRadius="sm"
                              flexShrink={0}
                              h="28px"
                              justify="center"
                              w="28px"
                            >
                              <Text color="blue.500" fontSize="sm" fontWeight="bold">
                                {item.institution.charAt(0)}
                              </Text>
                            </Flex>
                          )}
                          <VStack align="start" flex={1} gap={0}>
                            <Text
                              color={headingColor}
                              fontSize={['xs', 'sm']}
                              fontWeight="medium"
                              lineHeight="short"
                            >
                              {item.course}
                            </Text>
                            <Text color={textColor} fontSize="2xs" lineHeight="short">
                              {item.institution} · {item.year}
                            </Text>
                          </VStack>
                        </HStack>
                      )
                    })}
                  </VStack>
                )}
              </SimpleGrid>
            )}

            <Box borderColor={separatorColor} borderTop="1px dashed" w="full" />

            {/* Welcome + contact */}
            <Flex
              align={['center', 'center', 'center']}
              direction={['column', 'column', 'row']}
              gap={[2, 2, 4]}
              w="full"
            >
              <Text
                color={textColor}
                flex={1}
                fontSize="xs"
                fontStyle="italic"
                lineHeight="tall"
                textAlign={['center', 'center', 'left']}
              >
                {siteConfig.tagline}
              </Text>
              <HStack flexShrink={0} gap={2}>
                <Link
                  _hover={{ textDecoration: 'none' }}
                  href={`mailto:${siteOwner.contact.academicEmail}`}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <HStack
                    _hover={{ color: 'cyan.400' }}
                    color={textColor}
                    gap={1.5}
                    transition="all 0.15s"
                  >
                    <DynamicIcon boxSize={3.5} name="FaEnvelope" />
                    <Text fontFamily="mono" fontSize="xs">
                      email
                    </Text>
                  </HStack>
                </Link>
                <Text color={textColor} opacity={0.2}>
                  /
                </Text>
                <Link
                  _hover={{ textDecoration: 'none' }}
                  href={siteOwner.social.linkedin}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <HStack
                    _hover={{ color: 'cyan.400' }}
                    color={textColor}
                    gap={1.5}
                    transition="all 0.15s"
                  >
                    <DynamicIcon boxSize={3.5} name="FaLinkedin" />
                    <Text fontFamily="mono" fontSize="xs">
                      linkedin
                    </Text>
                  </HStack>
                </Link>
              </HStack>
            </Flex>
          </VStack>
          <MotionBox
            animate={{ opacity: 1, scale: 1 }}
            initial={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
          >
            <VStack gap={[2, 3]}>
              <Image
                alt={title}
                borderRadius="xl"
                boxSize={['150px', '180px', '220px']}
                objectFit="cover"
                src={withBase(`images/${avatar}`)}
              />
              {/* Social icons row below avatar */}
              <HStack gap={[1, 1.5]} justify="center">
                {heroSocialIcons.map((item) => (
                  <Link
                    _hover={{ textDecoration: 'none' }}
                    href={item.href}
                    key={item.label}
                    rel="noopener noreferrer"
                    target="_blank"
                    title={item.label}
                  >
                    <Box
                      _hover={{ color: item.color, transform: 'scale(1.2)' }}
                      color={socialIconColor}
                      cursor="pointer"
                      p={1.5}
                      transition="all 0.2s"
                    >
                      <DynamicIcon boxSize={[3, 3.5]} name={item.icon} />
                    </Box>
                  </Link>
                ))}
              </HStack>
              {(siteConfig.pets as { emoji: string; image: string; name: string }[]).length > 0 && (
                <HStack gap={[4, 5]} justify="center">
                  {(siteConfig.pets as { emoji: string; image: string; name: string }[]).map(
                    (pet) => (
                      <VStack gap={2} key={pet.name}>
                        {pet.image && (
                          <Image
                            alt={pet.name}
                            borderRadius="full"
                            boxSize={['40px', '50px']}
                            objectFit="cover"
                            src={pet.image}
                          />
                        )}
                        <Text fontSize="sm" fontWeight="medium">
                          {pet.name} {pet.emoji}
                        </Text>
                      </VStack>
                    ),
                  )}
                </HStack>
              )}
            </VStack>
          </MotionBox>
        </Stack>
      </Container>
    </Box>
  )
}

export default HeroSection
