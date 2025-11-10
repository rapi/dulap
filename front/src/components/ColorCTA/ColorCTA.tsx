'use client'

import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
import { FormattedMessage } from 'react-intl'

type ColorCTAProps = {
  href?: string
  /** Optional class for the wrapper <p> */
  className?: string
  /** Optional: push a dataLayer event like { event: 'cta_click', cta: trackingId } */
  trackingId?: string
  /** Optional click handler for the link */
  onLinkClick?: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void
}

type CTAEvent = {
  event: 'cta_click'
  cta: string
  component: 'ColorCTA'
  path: string
}

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>
  }
}

const ColorCTA: React.FC<ColorCTAProps> = ({
  href,
  className,
  trackingId,
  onLinkClick,
}) => {
  const router = useRouter()

  // Detect locale prefix from current path; default to '/ro'
  const targetHref = href ?? `/product/samples`

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    if (trackingId && typeof window !== 'undefined') {
      const evt: CTAEvent = {
        event: 'cta_click',
        cta: trackingId,
        component: 'ColorCTA',
        path: router.asPath ?? '',
      }
      window.dataLayer = window.dataLayer ?? []
      window.dataLayer.push(evt)
    }
    onLinkClick?.(e)
  }

  return (
    <p className={className} style={{ fontSize: 13, lineHeight: 1 }}>
      <FormattedMessage id="colorCTA.p1" />{' '}
      <Link
        href={targetHref}
        target="_blank"
        onClick={handleClick}
        aria-label="Comandă mostrele de culori gratuit"
        style={{ textDecoration: 'underline', color: '#444' }}
      >
        <FormattedMessage id="colorCTA.p2" />
      </Link>{' '}
    </p>
  )
}

export default ColorCTA
