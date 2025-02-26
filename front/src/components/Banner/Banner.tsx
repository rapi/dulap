import classes from './Banner.module.css'
import React from 'react'
import { CustomButton } from '~/components/CustomButton/CustomButton'
import { WardrobeIconMedium } from '~/components/Icons/Icons'
import Image from 'next/image'
export const Banner = () => {
  return (
    <section className={classes.hero}>
      <Image
        width={2056}
        height={1000}
        className={classes.heroImage}
        src="/banner-2.jpg"
        alt="Hero showcasing furniture"
      />
      <div className={classes.heroContent}>
        <h1 className={classes.heroTitle}>Dulapul tău - </h1>
        <h1 className={classes.heroTitle}>exact cum îl vrei</h1>
        <div className={classes.heroSubtitle}>
          <p>Mobilier creat după</p> 
          <ol className={classes.subtitleAnimationList}>
            <li className={classes.subtitleAnimationListItem}><span>dimensiunile</span></li>
            <li className={classes.subtitleAnimationListItem}><span>preferințele</span></li>
            <li className={classes.subtitleAnimationListItem}><span>culorile</span></li>
            <li className={classes.subtitleAnimationListItem}><span>gusturile</span></li>
          </ol>
          <p>tale</p>
        </div>
        <CustomButton size='large' icon={<WardrobeIconMedium/>}>Încearcă aici</CustomButton>
      </div>
    </section>
  )
}
