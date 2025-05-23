import React from 'react'
import styles from './GreenWall.module.css'
import Grid from '../Grid/grid'
import { Banner } from '../Banner/Banner'
import { BannerContentOffice } from '../BannerContentOffice/BannerContentOffice'

export const OfficeTable: React.FC = () => {
  return (
    <div className={styles.page}>
      {/* HERO */}
      <Banner
        href="/office-table/landing/office-table-landing.jpg"
        content={BannerContentOffice}
      ></Banner>

      <section>
        <Grid
          images={[
            { src: '/office-table/landing/img01.jpg' },
            { src: '/office-table/landing/img02.jpg' },
            { src: '/office-table/landing/office-table-animation.mp4' },
            { src: '/office-table/landing/img04.jpg' },
            { src: '/office-table/landing/img05.jpg' },
          ]}
          href="/configurator/office-table"
        ></Grid>
      </section>
    </div>
  )
}
