import classes from './Banner.module.css'
import React, { FC, ComponentType } from 'react'
import { BannerContent } from '../BannerContentDulap/BannerContentDulap'
import Image from 'next/image'
interface BannerProps {
  href?: string
  content?: ComponentType
}
export const Banner: FC<BannerProps> = ({
  href,
  content: Content = BannerContent,
}) => {
  return (
    <section className={classes.hero}>
      <Image
        width={2056}
        height={1000}
        className={classes.heroImage}
        src={ href || '/banner-2.jpg' }
        alt="Hero showcasing furniture"
        placeholder="blur"
        blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nNjAwJyBoZWlnaHQ9JzQwMCcgdmlld0JveD0nMCAwIDYwMCA0MDAnIHhtbG5zPSdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Zyc+PHJlY3Qgd2lkdGg9JzYwMCcgaGVpZ2h0PSc0MDAnIGZpbGw9JyNFMEUwRTAnLz48L3N2Zz4="
      />
      <div className={classes.overlay}></div>
      <Content />
    </section>
  )
}
