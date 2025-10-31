import React from 'react'
import HandymanIcon from '@mui/icons-material/Handyman'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import AutoGraphIcon from '@mui/icons-material/AutoGraph'
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
export const productInfoBarContent: ProductInfoBar[] = [
  {
    icon: <AutoGraphIcon />,
    title: <FormattedMessage id={'infoBar.warranty.title'} />,
    subtitle: <FormattedMessage id={'infoBar.warranty.subtitle'} />,
    link: {
      href: '/terms',
      label: <FormattedMessage id={'infoBar.readMore'} />,
    },
  },
  {
    icon: <LocalShippingIcon />,
    title: <FormattedMessage id={'infoBar.delivery.title'} />,
    subtitle: <FormattedMessage id={'infoBar.delivery.subtitle'} />,
    link: {
      href: '/terms',
      label: <FormattedMessage id={'infoBar.readMore'} />,
    },
  },
  {
    icon: <HandymanIcon />,
    title: <FormattedMessage id={'infoBar.assembly.title'} />,
    subtitle: <FormattedMessage id={'infoBar.assembly.subtitle'} />,
    link: {
      href: '/terms',
      label: <FormattedMessage id={'infoBar.readMore'} />,
    },
  },
]
