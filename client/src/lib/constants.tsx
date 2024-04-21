import {
  CreditCard,
  Layers,
  LayoutDashboard,
  Settings,
  Smile,
} from 'lucide-react'

const ICON_SIDEBAR_SIZE = 20

export const dashboardNavigation = [
  {
    title: 'Dashboard',
    icon: <LayoutDashboard size={ICON_SIDEBAR_SIZE} />,
    pathname: '/dashboard',
  },
  {
    title: 'My courses',
    icon: <Layers size={ICON_SIDEBAR_SIZE} />,
    pathname: '/my-courses',
  },
  {
    title: 'Earning',
    icon: <CreditCard size={ICON_SIDEBAR_SIZE} />,
    pathname: '/earning',
  },
  {
    title: 'Emojis',
    icon: <Smile size={ICON_SIDEBAR_SIZE} />,
    pathname: '/emojis',
  },
  {
    title: 'Settings',
    icon: <Settings size={ICON_SIDEBAR_SIZE} />,
    pathname: '/settings',
  },
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
