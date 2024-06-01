import { OrderApprove } from '@/components/icons/order-approve-icon'
import { AccountsIcon } from '@/components/icons/sidebar/accounts-icon'
import { SmileIcon } from '@/components/icons/sidebar/smile-icon'
import { UpgradeRole } from '@/components/icons/sidebar/updarade-role'
import { ViewIcon } from '@/components/icons/sidebar/view-icon'
import {
  BookText,
  BoomBox,
  Briefcase,
  Camera,
  CreditCard,
  Dumbbell,
  GitBranchPlus,
  HandHeart,
  Languages,
  Laptop,
  Layers,
  LayoutDashboard,
  Megaphone,
  Palette,
  PersonStanding,
  School,
  Settings,
  Smile,
  Split,
  UserRoundCog,
} from 'lucide-react'

const ICON_SIDEBAR_SIZE = 20

export const dashboardNavigation = [
  // {
  //   title: 'Dashboard',
  //   icon: <LayoutDashboard size={ICON_SIDEBAR_SIZE} />,
  //   pathname: '/dashboard',
  // },
  {
    title: 'My courses',
    icon: <ViewIcon />,
    pathname: '/my-courses',
  },
  {
    title: 'Approves',
    icon: <OrderApprove />,
    pathname: '/approves',
  },
  {
    title: 'Users',
    icon: <AccountsIcon />,
    pathname: '/users',
  },
  {
    title: 'Form requests',
    icon: <UpgradeRole />,
    pathname: '/forms',
  },
  {
    title: 'Emojis',
    icon: <SmileIcon />,
    pathname: '/emojis',
  },
  // {
  //   title: 'Settings',
  //   icon: <Settings size={ICON_SIDEBAR_SIZE} />,
  //   pathname: '/settings',
  // },
]

export const categories = [
  'DEVELOPMENT',
  'BUSINESS',
  'DESIGN',
  'MARKETING',
  'IT',
  'PERSONAL_DEVELOPMENT',
  'PHOTOGRAPHY',
  'MUSIC',
  'HEALTH',
  'FITNESS',
  'LIFESTYLE',
  'TEACHING',
  'ACADEMICS',
  'LANGUAGE',
  'OTHER',
]

export const CATEGORIES = [
  {
    name: 'Development',
    value: 'DEVELOPMENT',
    icon: <Dumbbell />,
    path: '/category/development',
    description:
      'Enhance your coding skills and build amazing software projects in the Development category! 💻✨',
  },
  {
    name: 'Business',
    value: 'BUSINESS',
    icon: <Briefcase />,
    path: '/category/business',
    description:
      'Master the art of entrepreneurship, leadership, and management in the Business category! 📈💼',
  },
  {
    name: 'Design',
    value: 'DESIGN',
    icon: <Palette />,
    path: '/category/design',
    description:
      'Unleash your creativity and learn how to craft beautiful designs in the Design category! 🎨✏️',
  },
  {
    name: 'Marketing',
    value: 'MARKETING',
    icon: <Megaphone />,
    path: '/category/marketing',
    description:
      'Delve into the world of digital marketing and reach your audience effectively in the Marketing category! 📣🎯',
  },
  {
    name: 'IT',
    value: 'IT',
    icon: <Laptop />,
    path: '/category/it',
    description:
      'Explore the latest trends in technology and sharpen your IT skills in the IT category! 💻🔧',
  },
  {
    name: 'Personal Development',
    value: 'PERSONAL_DEVELOPMENT',
    icon: <PersonStanding />,
    path: '/category/personal-development',
    description:
      'Invest in yourself and grow personally and professionally in the Personal Development category! 🌱💪',
  },
  {
    name: 'Photography',
    value: 'PHOTOGRAPHY',
    icon: <Camera />,
    path: '/category/photography',
    description:
      'Capture moments beautifully and master the art of photography in the Photography category! 📸🌅',
  },
  {
    name: 'Music',
    value: 'MUSIC',
    icon: <BoomBox />,
    path: '/category/music',
    description:
      'Dive into the world of music and express yourself through rhythm and melodies in the Music category! 🎵🎶',
  },
  {
    name: 'Health',
    value: 'HEALTH',
    icon: <HandHeart />,
    path: '/category/health',
    description:
      'Prioritize your well-being and learn how to maintain a healthy lifestyle in the Health category! 🍏🏋️‍♂️',
  },
  {
    name: 'Fitness',
    value: 'FITNESS',
    icon: <Dumbbell />,
    path: '/category/fitness',
    description:
      'Break a sweat and stay active with fitness routines and exercise tips in the Fitness category! 💪🏃‍♀️',
  },
  {
    name: 'Lifestyle',
    value: 'LIFESTYLE',
    icon: <Split />,
    path: '/category/lifestyle',
    description:
      'Explore various aspects of modern living and find inspiration for a fulfilling lifestyle in the Lifestyle category! 🌿🛋️',
  },
  {
    name: 'Teaching',
    value: 'TEACHING',
    icon: <School />,
    path: '/category/teaching',
    description:
      'Share knowledge and empower others through effective teaching strategies in the Teaching category! 📚👩‍🏫',
  },
  {
    name: 'Academics',
    value: 'ACADEMICS',
    icon: <BookText />,
    path: '/category/academics',
    description:
      'Expand your knowledge and excel in your academic pursuits with resources in the Academics category! 📖🎓',
  },
  {
    name: 'Language',
    value: 'LANGUAGE',
    icon: <Languages />,
    path: '/category/language',
    description:
      'Immerse yourself in new languages and broaden your communication skills in the Language category! 🗣️🌍',
  },
  {
    name: 'Other',
    value: 'OTHER',
    icon: <GitBranchPlus />,
    path: '/category/other',
    description:
      'Discover diverse topics and explore a variety of interests in the Other category! 🌐🔍',
  },
]

export const MEDIA_URL = `${process.env.NEXT_PUBLIC_API_BASE}/files`
