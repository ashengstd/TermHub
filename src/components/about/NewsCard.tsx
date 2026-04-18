import { Badge, Box, Button, Flex, Heading, HStack, Link, Text, VStack } from '@chakra-ui/react'
import React from 'react'

import { useColorModeValue } from '@/hooks/useColorMode'

import { type NewsItem } from '../../types'
import DynamicIcon from '../DynamicIcon'

interface NewsCardProps {
  news: NewsItem
}

const NewsCard: React.FC<NewsCardProps> = ({ news }) => {
  // Get appropriate icon based on news type
  const iconBase = news.iconColor.split('.')[0]
  const cardBg = useColorModeValue('white', 'gray.800')
  const cardBorderColor = useColorModeValue('gray.100', 'gray.700')
  const badgeBg = useColorModeValue(`${iconBase}.500`, `${iconBase}.600`)
  const badgeShadow = useColorModeValue('0 2px 5px rgba(0,0,0,0.1)', '0 2px 5px rgba(0,0,0,0.3)')
  const badgeTextColor = useColorModeValue('white', 'white')
  const iconBg = useColorModeValue(`${iconBase}.50`, `${iconBase}.900`)
  const iconColor = useColorModeValue(`${iconBase}.500`, `${iconBase}.200`)
  const descColor = useColorModeValue('gray.600', 'gray.400')

  const getIconName = () => {
    switch (news.type) {
      case 'course':
        return 'FaYoutube'
      case 'publication':
        return 'FaCode'
      case 'talk':
        return 'SiBilibili'
      default:
        return news.icon || 'FaCode'
    }
  }

  return (
    <Box
      _hover={{ shadow: 'md', transform: 'translateY(-4px)' }}
      aria-labelledby={`news-title-${news.title.replace(/\s+/g, '-').toLowerCase()}`}
      bg={cardBg}
      borderColor={cardBorderColor}
      borderRadius="lg"
      borderWidth="1px"
      overflow="hidden"
      p={0}
      position="relative"
      role="article"
      shadow="sm"
      transition="all 0.3s"
    >
      {/* Top color bar */}
      <Box bg={news.iconColor} h="4px" w="full" />

      {/* Date Badge - Top Right Absolute Position */}
      {news.date && (
        <Badge
          alignItems="center"
          bg={badgeBg}
          borderRadius="md"
          boxShadow={badgeShadow}
          color={badgeTextColor}
          colorPalette={iconBase}
          display="flex"
          fontSize="xs"
          fontWeight="medium"
          position="absolute"
          px={2}
          py={1}
          right={2}
          top={2}
          zIndex={1}
        >
          <DynamicIcon boxSize={3} mr={1} name="FaClock" />
          {news.date}
        </Badge>
      )}

      {/* Content area */}
      <Box p={4}>
        {/* Title area and badges */}
        <Flex align="flex-start" mb={3}>
          <Box
            alignItems="center"
            aria-hidden="true"
            bg={iconBg}
            borderRadius="md"
            color={iconColor}
            display="flex"
            fontSize="xl"
            height="32px"
            justifyContent="center"
            lineHeight="1"
            mr={3}
            p={2}
            width="32px"
          >
            <DynamicIcon boxSize={4} name={getIconName()} />
          </Box>
          <VStack align="start" gap={1} pr={12} width="100%">
            <Heading id={`news-title-${news.title.replace(/\s+/g, '-').toLowerCase()}`} size="xs">
              {news.title}
            </Heading>

            {news.badge && (
              <Badge
                borderRadius="full"
                colorPalette={news.iconColor.split('.')[0]}
                fontSize="2xs"
                px={2}
                py={0.5}
              >
                {news.badge}
              </Badge>
            )}
          </VStack>
        </Flex>

        {/* Description text */}
        <Text color={descColor} fontSize="sm" lineHeight="taller" mb={3}>
          {news.description}
        </Text>

        {/* Button link area */}
        <HStack flexWrap="wrap" gap={2} mt={2}>
          {news.links.map((link, index) => {
            const LinkIcon = link.icon ? <DynamicIcon fontSize="xs" name={link.icon} /> : undefined
            return (
              <Link
                aria-label={`${link.text} for ${news.title}`}
                href={link.url}
                key={index}
                rel="noopener noreferrer"
                target="_blank"
              >
                <Button colorPalette={iconBase} size="xs" variant="outline">
                  {LinkIcon && (
                    <Box aria-hidden="true" as="span">
                      {LinkIcon}
                    </Box>
                  )}
                  {link.text}
                </Button>
              </Link>
            )
          })}
        </HStack>
      </Box>
    </Box>
  )
}

export default NewsCard
