import React from 'react'
import styles from './GreenWall.module.css'
import Grid2 from '../Grid/grid2'
import { BannerTable } from '../Banner/BannerTable'
import { BannerWoodenCollection } from '~/components/Banner/BannerWoodenCollection'

export const Table: React.FC = () => {
  return (
    <div className={styles.page}>
      {/* HERO */}
      <BannerWoodenCollection
        href="/table/landing-1.png"
        content={BannerTable}
      ></BannerWoodenCollection>

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
