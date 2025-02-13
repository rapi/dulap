import classes from './Banner.module.css'
import React from 'react'
import { CustomButton } from '~/components/CustomButton/CustomButton'
import { WardrobeIcon } from '~/components/Icons/Icons'
export const Banner = () => {
  return (
    <section className={classes.hero}>
      <img
        className={classes.heroImage}
        src="/banner-2.jpg"
        alt="Hero showcasing furniture"
      />
      <div className={classes.heroContent}>
        <h1>Dulapul tău - </h1>
        <h1>exact cum îl vrei</h1>
        <p className="heroSubtitle">
          Mobilier creat după <span>dimensiunile</span>
          <span>preferințele</span> <span>culorile</span> tale
        </p>
        <CustomButton icon={<WardrobeIcon />}>Încearcă aici</CustomButton>
      </div>
    </section>
  )
}
