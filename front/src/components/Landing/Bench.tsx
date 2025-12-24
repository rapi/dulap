import React from 'react'
import styles from './GreenWall.module.css'
import Grid2 from '../Grid/grid2'
import { BannerWoodenCollection } from '../Banner/BannerWoodenCollection'
import { BannerBench } from '../Banner/BannerBench'

export const Bench: React.FC = () => {
  return (
    <div className={styles.page}>
      {/* HERO */}
      <BannerWoodenCollection
        href="/bench/landing.jpg"
        content={BannerBench}
      ></BannerWoodenCollection>

      <section>
        <Grid2
          images={[
            { src: '/bench/5.jpg' },
            { src: '/bench/landing.jpg' },
            { src: '/bench/3.jpg' },
            { src: '/bench/4.jpg' },
            { src: '/bench/1.jpg' },
          ]}
          href="/"
        ></Grid2>
      </section>
    </div>
  )
}
