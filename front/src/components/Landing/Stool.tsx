import React from 'react'
import styles from './GreenWall.module.css'
import Grid2 from '../Grid/grid2'
import { BannerStool } from '../Banner/BannerStool'
import { BannerWoodenCollection } from '~/components/Banner/BannerWoodenCollection'

export const Stool: React.FC = () => {
  return (
    <div className={styles.page}>
      {/* HERO */}
      <BannerWoodenCollection
        href="/stool/landing.png"
        content={BannerStool}
      ></BannerWoodenCollection>

      <section>
        <Grid2
          images={[
            { src: '/stool/1.png' },
            { src: '/stool/landing.png' },
            { src: '/stool/3.png' },
            { src: '/stool/4.png' },
            { src: '/stool/5.png' },
          ]}
          href="/"
        ></Grid2>
      </section>
    </div>
  )
}
