import React from 'react'
import styles from './GreenWall.module.css'
import Grid2 from '../Grid/grid2'
import { Banner } from '../Banner/Banner'
import { BannerStool } from '../Banner/BannerStool'

export const Stool: React.FC = () => {
  return (
    <div className={styles.page}>
      {/* HERO */}
      <Banner
        href="/stool/landing.png"
        content={BannerStool}
      ></Banner>

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
