import { Icon } from '@chakra-ui/react'
import { type IconType } from 'react-icons'
import {
  FaArrowRight,
  FaAward,
  FaBolt,
  FaBrain,
  FaBriefcase,
  FaChalkboardTeacher,
  FaChartBar,
  FaChevronRight,
  FaClock,
  FaCode,
  FaCodeBranch,
  FaCoffee,
  FaCoins,
  FaDatabase,
  FaEnvelope,
  FaExternalLinkAlt,
  FaFileAlt,
  FaFolder,
  FaGithub,
  FaGlobe,
  FaGraduationCap,
  FaHeart,
  FaLightbulb,
  FaLinkedin,
  FaMedal,
  FaMedium,
  FaPlane,
  FaPlay,
  FaProjectDiagram,
  FaRobot,
  FaRocket,
  FaStar,
  FaTerminal,
  FaTrophy,
  FaUser,
  FaYoutube,
} from 'react-icons/fa'
import {
  SiArxiv,
  SiBilibili,
  SiCsdn,
  SiGooglescholar,
  SiNotion,
  SiX,
  SiZhihu,
} from 'react-icons/si'

const icons: Record<string, IconType> = {
  FaArrowRight,
  FaAward,
  FaBolt,
  FaBrain,
  FaBriefcase,
  FaChalkboardTeacher,
  FaChartBar,
  FaChevronRight,
  FaClock,
  FaCode,
  FaCodeBranch,
  FaCoffee,
  FaCoins,
  FaDatabase,
  FaEnvelope,
  FaExternalLinkAlt,
  FaFileAlt,
  FaFolder,
  FaGithub,
  FaGlobe,
  FaGraduationCap,
  FaHeart,
  FaLightbulb,
  FaLinkedin,
  FaMedal,
  FaMedium,
  FaPlane,
  FaPlay,
  FaProjectDiagram,
  FaRobot,
  FaRocket,
  FaStar,
  FaTerminal,
  FaTrophy,
  FaUser,
  FaYoutube,
  SiArxiv,
  SiBilibili,
  SiCsdn,
  SiGooglescholar,
  SiNotion,
  SiX,
  SiZhihu,
}

interface DynamicIconProps {
  [key: string]: unknown
  boxSize?: number | number[] | string | string[]
  color?: string
  name?: string
}

const DynamicIcon: React.FC<DynamicIconProps> = ({ name, ...props }) => {
  if (!name) return null
  const IconComponent = (icons as Record<string, React.ComponentType | undefined>)[name] ?? FaCode
  return <Icon as={IconComponent} {...props} />
}

export default DynamicIcon
