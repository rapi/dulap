import React from 'react'
import styles from './GreenWall.module.css'
import Grid2 from '../Grid/grid2'
import { Banner } from '../Banner/Banner'
import { BannerBench } from '../Banner/BannerBench'

export const Bench: React.FC = () => {
  return (
    <div className={styles.page}>
      {/* HERO */}
      <Banner
        href="/bench/landing.jpg"
        content={BannerBench}
      ></Banner>

      <section>
        <Grid2
          images={[
            { src: '/bench/1.jpg' },
            { src: '/bench/landing.jpg' },
            { src: '/bench/3.jpg' },
            { src: '/bench/4.jpg' },
            { src: '/bench/5.jpg' },
          ]}
          href="/"
        ></Grid2>
      </section>
    </div>
  )
}
