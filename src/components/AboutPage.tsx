import {
  Box,
  Container,
  Flex,
  Grid,
  GridItem,
  Heading,
  HStack,
  Image,
  Link,
  Text,
  VStack,
  useColorModeValue,
  useColorMode,
  Divider,
  Badge,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocalizedData } from "@/hooks/useLocalizedData";
import { heroSocialIcons } from "@/site.config";
import { withBase } from "@/utils/asset";
import { terminalPalette } from "@/config/theme";
import DynamicIcon from "./DynamicIcon";
import JourneySection from "./sections/JourneySection";
import BioSection from "./sections/BioSection";
import MentorshipSection from "./sections/MentorshipSection";

/* ── Typewriter Terminal ──────────────────────────────────── */

const TYPING_SPEED = 65;
const DELETING_SPEED = 32;
const PAUSE_AFTER_TYPE = 2200;
const PAUSE_AFTER_DELETE = 450;

type TypePhase = "typing" | "pausing" | "deleting" | "waiting";

const TerminalTypewriter: React.FC = () => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const tc = terminalPalette.colors(isDark);

  const { siteOwner, about } = useLocalizedData();
  const phrases = (siteOwner.rotatingSubtitles ?? []) as string[];
  const username = siteOwner.terminalUsername ?? "user";
  const fullName = siteOwner.name.full ?? "";

  const paragraphs = (about.journey ?? "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

  const [displayText, setDisplayText] = useState("");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [phase, setPhase] = useState<TypePhase>("typing");
  const [cursorOn, setCursorOn] = useState(true);

  // Cursor blink — always blinks, just less noticeable while typing
  useEffect(() => {
    const id = setInterval(() => setCursorOn((v) => !v), 530);
    return () => clearInterval(id);
  }, []);

  // State machine
  useEffect(() => {
    if (!phrases.length) return;
    const current = phrases[phraseIndex];

    if (phase === "typing") {
      if (displayText.length < current.length) {
        const t = setTimeout(
          () => {
            setDisplayText(current.slice(0, displayText.length + 1));
          },
          TYPING_SPEED + Math.random() * 25,
        ); // slight jitter feels natural
        return () => clearTimeout(t);
      } else {
        const t = setTimeout(() => setPhase("pausing"), 80);
        return () => clearTimeout(t);
      }
    }

    if (phase === "pausing") {
      const t = setTimeout(() => setPhase("deleting"), PAUSE_AFTER_TYPE);
      return () => clearTimeout(t);
    }

    if (phase === "deleting") {
      if (displayText.length > 0) {
        const t = setTimeout(() => {
          setDisplayText((prev) => prev.slice(0, -1));
        }, DELETING_SPEED);
        return () => clearTimeout(t);
      } else {
        const t = setTimeout(() => {
          setPhraseIndex((i) => (i + 1) % phrases.length);
          setPhase("typing");
        }, PAUSE_AFTER_DELETE);
        return () => clearTimeout(t);
      }
    }
  }, [displayText, phase, phraseIndex, phrases]);

  const prompt = `[${username}@portfolio ~]$`;

  // Static history lines shown above the animated line
  const historyLines: { prompt: string; cmd: string; output?: string }[] = [
    {
      prompt,
      cmd: "whoami",
      output: fullName,
    },
  ];

  const fadeIn = (delay: number) => ({
    opacity: 0,
    animation: `termFadeIn 0.4s ease ${delay}s forwards`,
    "@keyframes termFadeIn": {
      from: { opacity: 0, transform: "translateY(5px)" },
      to: { opacity: 1, transform: "translateY(0)" },
    },
  });

  return (
    <Box
      bg={tc.bg}
      borderRadius="xl"
      overflow="hidden"
      border={`1px solid ${tc.border}`}
      fontFamily="mono"
      fontSize={["xs", "sm"]}
      boxShadow={
        isDark ? "0 8px 32px rgba(0,0,0,0.4)" : "0 4px 24px rgba(0,0,0,0.08)"
      }
    >
      {/* macOS-style title bar */}
      <Flex
        px={4}
        py={2.5}
        bg={tc.header}
        align="center"
        borderBottom={`1px solid ${tc.border}`}
        position="relative"
      >
        <HStack spacing={1.5}>
          <Box
            w="11px"
            h="11px"
            borderRadius="full"
            bg="#ff5f57"
            flexShrink={0}
          />
          <Box
            w="11px"
            h="11px"
            borderRadius="full"
            bg="#febc2e"
            flexShrink={0}
          />
          <Box
            w="11px"
            h="11px"
            borderRadius="full"
            bg="#28c840"
            flexShrink={0}
          />
        </HStack>
        <Text
          fontSize="xs"
          color={tc.secondary}
          position="absolute"
          left="50%"
          transform="translateX(-50%)"
          pointerEvents="none"
          letterSpacing="wide"
        >
          {username} — zsh
        </Text>
      </Flex>

      {/* Terminal body */}
      <Box px={[4, 5, 6]} py={[4, 5]} lineHeight="tall">
        {/* Login hint */}
        <Text color={tc.muted} mb={4} fontSize="xs">
          Last login: {new Date().toDateString()} on ttys001
        </Text>

        {/* Static history */}
        {historyLines.map((line, i) => (
          <Box key={i} mb={3}>
            <HStack spacing={2} flexWrap="wrap">
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
          <HStack spacing={2} flexWrap="wrap" mb={2}>
            <Text color={tc.prompt} flexShrink={0}>
              {prompt}
            </Text>
            <Text color={tc.command}>cat</Text>
            <Text color={tc.param}>profile.md</Text>
          </HStack>

          <Box fontSize="xs" pl={1}>
            {/* Comment header — staggered */}
            <Text
              color={tc.highlight}
              fontWeight="semibold"
              mb={0.5}
              sx={fadeIn(0.05)}
            >
              {"# ── "}
              {siteOwner.name.full}
              {" · M.S. Student @ NUAA ──────────────"}
            </Text>
            <Text color={tc.secondary} mb={3} sx={fadeIn(0.18)}>
              {"# Research: LLM Multi-Agent Systems · Reasoning Optimization"}
            </Text>

            {/* Bio paragraphs — each fades in with increasing delay */}
            <VStack spacing={2} align="start">
              {paragraphs.map((para, i) => (
                <Text
                  key={i}
                  color={tc.text}
                  lineHeight="tall"
                  sx={fadeIn(0.35 + i * 0.22)}
                >
                  {para}
                </Text>
              ))}
            </VStack>
          </Box>
        </Box>

        {/* Live typewriter line */}
        <Box>
          <HStack spacing={2} flexWrap="wrap">
            <Text color={tc.prompt} flexShrink={0}>
              {prompt}
            </Text>
            <Text color={tc.command}>echo</Text>
            <Text color={tc.param}>$INTRO</Text>
          </HStack>

          {/* Output line with cursor */}
          <HStack spacing={0} mt={0.5} minH="1.5em" align="center">
            <Text color={tc.text} whiteSpace="pre">
              {displayText}
            </Text>
            {/* Block cursor */}
            <Box
              display="inline-block"
              w="0.58em"
              h="1.15em"
              bg={tc.text}
              opacity={cursorOn ? 0.85 : 0}
              transition="opacity 0.08s"
              ml="1px"
              borderRadius="1px"
            />
          </HStack>
        </Box>
      </Box>
    </Box>
  );
};

/* ── Profile Sidebar ──────────────────────────────────────── */

const ProfileSidebar: React.FC = () => {
  const { siteOwner, siteConfig } = useLocalizedData();
  const { t } = useTranslation();

  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.600", "gray.400");
  const headingColor = useColorModeValue("gray.800", "gray.100");
  const promptColor = "yellow.400";
  const tagBg = useColorModeValue("gray.100", "gray.700");
  const tagColor = useColorModeValue("gray.600", "gray.300");
  const dividerColor = useColorModeValue("gray.100", "gray.700");

  type SkillItem = string | { name: string; icon?: string };
  const skills = (siteOwner.skills ?? []) as SkillItem[];
  const getName = (s: SkillItem) => (typeof s === "string" ? s : s.name);
  const getIcon = (s: SkillItem) =>
    typeof s === "string" ? undefined : s.icon;

  return (
    <Box
      bg={cardBg}
      border="1px solid"
      borderColor={borderColor}
      borderRadius="xl"
      overflow="hidden"
      position={["static", "static", "sticky"]}
      top="80px"
    >
      {/* Terminal title bar */}
      <Flex
        px={4}
        py={2.5}
        bg={useColorModeValue("gray.50", "gray.900")}
        borderBottom="1px solid"
        borderColor={borderColor}
        align="center"
        gap={2}
      >
        <HStack spacing={1.5}>
          <Box w="10px" h="10px" borderRadius="full" bg="red.400" />
          <Box w="10px" h="10px" borderRadius="full" bg="yellow.400" />
          <Box w="10px" h="10px" borderRadius="full" bg="green.400" />
        </HStack>
        <Text fontFamily="mono" fontSize="xs" color={textColor} ml={2}>
          whoami
        </Text>
      </Flex>

      <VStack spacing={0} align="stretch">
        {/* Avatar + Name */}
        <VStack spacing={3} px={5} pt={6} pb={4} align="center">
          <Image
            src={withBase(`images/${siteConfig.avatar}`)}
            alt={siteOwner.name.full}
            borderRadius="xl"
            boxSize={["100px", "120px", "128px"]}
            objectFit="cover"
            border="2px solid"
            borderColor={useColorModeValue("gray.200", "gray.600")}
          />
          <VStack spacing={1} align="center">
            <HStack spacing={1} fontFamily="mono" fontSize="sm">
              <Text color={promptColor} fontWeight="bold">
                ~
              </Text>
              <Text color="cyan.400" fontWeight="semibold">
                {siteOwner.name.full}
              </Text>
            </HStack>
            <Text
              fontSize="xs"
              color={textColor}
              textAlign="center"
              lineHeight="short"
            >
              {siteConfig.tagline ?? ""}
            </Text>
          </VStack>
        </VStack>

        <Divider borderColor={dividerColor} />

        {/* Meta info */}
        <VStack spacing={2.5} px={5} py={4} align="stretch">
          {siteOwner.contact.location && (
            <HStack spacing={2.5}>
              <DynamicIcon name="FaMapMarkerAlt" boxSize={3} color="cyan.400" />
              <Text fontSize="xs" color={textColor} fontFamily="mono">
                {siteOwner.contact.location}
              </Text>
            </HStack>
          )}
          {siteOwner.contact.email && (
            <HStack spacing={2.5}>
              <DynamicIcon name="FaEnvelope" boxSize={3} color="cyan.400" />
              <Link
                href={`mailto:${siteOwner.contact.email}`}
                fontSize="xs"
                color={textColor}
                fontFamily="mono"
                _hover={{ color: "cyan.400", textDecoration: "none" }}
                isTruncated
              >
                {siteOwner.contact.email}
              </Link>
            </HStack>
          )}
          {siteOwner.social.github && (
            <HStack spacing={2.5}>
              <DynamicIcon name="FaGithub" boxSize={3} color="cyan.400" />
              <Link
                href={siteOwner.social.github}
                isExternal
                fontSize="xs"
                color={textColor}
                fontFamily="mono"
                _hover={{ color: "cyan.400", textDecoration: "none" }}
              >
                {siteOwner.social.github.replace("https://github.com/", "@")}
              </Link>
            </HStack>
          )}
        </VStack>

        <Divider borderColor={dividerColor} />

        {/* Social links */}
        {heroSocialIcons.length > 0 && (
          <>
            <HStack spacing={2} px={5} py={3} flexWrap="wrap">
              {heroSocialIcons.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  isExternal
                  _hover={{ textDecoration: "none" }}
                >
                  <HStack
                    spacing={1.5}
                    px={2.5}
                    py={1.5}
                    borderRadius="md"
                    fontSize="xs"
                    fontFamily="mono"
                    color={textColor}
                    border="1px solid"
                    borderColor={borderColor}
                    transition="all 0.2s"
                    _hover={{
                      color: item.color,
                      borderColor: item.color,
                      transform: "translateY(-1px)",
                    }}
                  >
                    <DynamicIcon name={item.icon} boxSize={3} />
                    <Text>{item.label}</Text>
                  </HStack>
                </Link>
              ))}
            </HStack>
            <Divider borderColor={dividerColor} />
          </>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <Box px={5} py={4}>
            <HStack spacing={2} mb={3}>
              <Box h="2px" w="12px" bg="cyan.400" borderRadius="full" />
              <Text
                fontSize="xs"
                fontFamily="mono"
                fontWeight="semibold"
                color={headingColor}
                textTransform="uppercase"
                letterSpacing="wider"
              >
                {t("about.skills", "Skills")}
              </Text>
            </HStack>
            <Flex gap={1.5} flexWrap="wrap">
              {skills.map((skill) => (
                <HStack
                  key={getName(skill)}
                  spacing={1}
                  px={2}
                  py={0.5}
                  bg={tagBg}
                  borderRadius="sm"
                  fontSize="2xs"
                  fontFamily="mono"
                  color={tagColor}
                >
                  {getIcon(skill) && (
                    <DynamicIcon
                      name={getIcon(skill)!}
                      boxSize={2.5}
                      color={useColorModeValue("gray.500", "gray.400")}
                    />
                  )}
                  <Text>{getName(skill)}</Text>
                </HStack>
              ))}
            </Flex>
          </Box>
        )}
      </VStack>
    </Box>
  );
};

/* ── Page Header ──────────────────────────────────────────── */

const PageHeader: React.FC = () => {
  const { t } = useTranslation();
  const { siteOwner } = useLocalizedData();
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.500", "gray.500");

  return (
    <Box borderBottom="1px solid" borderColor={borderColor} pb={6} mb={2}>
      <HStack spacing={2} fontFamily="mono" fontSize={["sm", "md"]} mb={2}>
        <Text color="yellow.400" fontWeight="bold">
          $
        </Text>
        <Text color="cyan.400">cat</Text>
        <Text color={useColorModeValue("gray.700", "gray.200")}>about.md</Text>
        <Box
          as="span"
          display="inline-block"
          w="2px"
          h="1em"
          bg="cyan.400"
          animation="blink 1s step-end infinite"
          sx={{
            "@keyframes blink": {
              "0%, 100%": { opacity: 1 },
              "50%": { opacity: 0 },
            },
          }}
        />
      </HStack>
      <HStack spacing={3} mt={3}>
        <Box h="3px" w="32px" bg="cyan.400" borderRadius="full" />
        <Heading size={["md", "lg"]} fontWeight="bold">
          {t("nav.about", "About")}
        </Heading>
        <Badge
          fontFamily="mono"
          fontSize="2xs"
          colorScheme="cyan"
          variant="subtle"
          px={2}
        >
          {siteOwner.name.full}
        </Badge>
      </HStack>
      <Text fontSize="xs" color={textColor} fontFamily="mono" mt={1}>
        #{" "}
        {t(
          "about.aboutDescription",
          "Personal background, experience & skills",
        )}
      </Text>
    </Box>
  );
};

/* ── About Page ───────────────────────────────────────────── */

const AboutPage: React.FC = () => {
  return (
    <Box w="full" py={[4, 6, 8]}>
      <Container maxW={["full", "full", "7xl"]} px={[3, 4, 8]}>
        <PageHeader />

        <Grid
          templateColumns={["1fr", "1fr", "280px 1fr", "300px 1fr"]}
          gap={[6, 6, 8]}
          mt={6}
          alignItems="start"
        >
          {/* Sidebar */}
          <GridItem>
            <ProfileSidebar />
          </GridItem>

          {/* Main content */}
          <GridItem>
            <VStack spacing={[6, 7, 8]} align="stretch">
              {/* Typewriter terminal — self intro */}
              <TerminalTypewriter />

              {/* Bio */}
              <BioSection />

              {/* Journey / Timeline */}
              <JourneySection />

              {/* Tech Stack */}
              <MentorshipSection />
            </VStack>
          </GridItem>
        </Grid>
      </Container>
    </Box>
  );
};

export default AboutPage;
