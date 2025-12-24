import React from 'react'
import styles from './GreenWall.module.css'
import Grid2 from '../Grid/grid2'
import { Banner } from '../Banner/Banner'
import { BannerTable } from '../Banner/BannerTable'

export const Table: React.FC = () => {
  return (
    <div className={styles.page}>
      {/* HERO */}
      <Banner
        href="/table/landing-1.png"
        content={BannerTable}
      ></Banner>

      <section>
        <Grid2
          images={[
            { src: '/table/1.jpg' },
            { src: '/table/2.jpg' },
            { src: '/table/3.png' },
            { src: '/table/4.png' },
            { src: '/table/5.jpg' },
          ]}
          href="/"
        ></Grid2>
      </section>
    </div>
  )
}
