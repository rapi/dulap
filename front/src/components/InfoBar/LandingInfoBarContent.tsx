import React from 'react'
import DoorSlidingIcon from '@mui/icons-material/DoorSliding'
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch'
import ColorLensIcon from '@mui/icons-material/ColorLens'
import { FormattedMessage } from 'react-intl'

type IconLike = React.ReactNode | { src: string; alt?: string } | null

type LinkLike =
  | string
  | { href: string; label?: React.ReactNode; target?: string; rel?: string }
  | { onClick: () => void; label?: React.ReactNode }

type ProductInfoBar = {
  icon?: IconLike
  title: React.ReactNode
  subtitle?: React.ReactNode
  link?: LinkLike
  className?: string
}
export const landingInfoBarContent: ProductInfoBar[] = [
  {
    icon: <DoorSlidingIcon />,
    title: <FormattedMessage id={'infoBar.design.title'} />,
    subtitle: <FormattedMessage id={'infoBar.design.subtitle'} />,
    link: {
      href: '/configurator/stand',
      label: <FormattedMessage id={'infoBar.choose'} />,
    },
  },
  {
    icon: <RocketLaunchIcon />,
    title: <FormattedMessage id={'infoBar.fastDelivery.title'} />,
    subtitle: <FormattedMessage id={'infoBar.fastDelivery.subtitle'} />,
    link: {
      href: '/configurator/stand',
      label: <FormattedMessage id={'infoBar.choose'} />,
    },
  },
  {
    icon: <ColorLensIcon />,
    title: <FormattedMessage id={'infoBar.color.title'} />,
    subtitle: <FormattedMessage id={'infoBar.color.subtitle'} />,
    link: {
      href: '/configurator/stand',
      label: <FormattedMessage id={'infoBar.choose'} />,
    },
  },
]
