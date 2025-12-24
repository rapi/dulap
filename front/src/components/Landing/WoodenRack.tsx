import React from 'react'
import styles from './GreenWall.module.css'
import Grid2 from '../Grid/grid2'
import { Banner } from '../Banner/Banner'
import { BannerWoodenRack } from '../Banner/BannerWoodenRack'

export const WoodenRack: React.FC = () => {
  return (
    <div className={styles.page}>
      {/* HERO */}
      <Banner
        href="/wooden-rack/landing.jpg"
        content={BannerWoodenRack}
      ></Banner>

      <section>
        <Grid2
          images={[
            { src: '/wooden-rack/1.jpg' },
            { src: '/wooden-rack/landing.jpg' },
            { src: '/wooden-rack/3.jpg' },
            { src: '/wooden-rack/4.jpg' },
            { src: '/wooden-rack/5.jpg' },
          ]}
          href="/"
        ></Grid2>
      </section>
    </div>
  )
}
