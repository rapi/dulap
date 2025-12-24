import React from 'react'
import styles from './GreenWall.module.css'
import Grid2 from '../Grid/grid2'
import { BannerWoodenRack } from '../Banner/BannerWoodenRack'
import { BannerWoodenCollection } from '~/components/Banner/BannerWoodenCollection'

export const WoodenRack: React.FC = () => {
  return (
    <div className={styles.page}>
      {/* HERO */}
      <BannerWoodenCollection
        href="/wooden-rack/landing.jpg"
        content={BannerWoodenRack}
      ></BannerWoodenCollection>

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
