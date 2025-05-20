import React from 'react'
import styles from './GreenWall.module.css'
import Grid from '../Grid/grid'
import { Banner } from '../Banner/Banner'
import { BannerContentSecond } from '../BannerContentSecond/BannerContentSecond'

type FeatureProps = {
  icon: string
  title: string
  text: string
}

const Feature: React.FC<FeatureProps> = ({ icon, title, text }) => (
  <div className={styles.featureCard}>
    <div className={styles.featureIcon}>{icon}</div>
    <div>
      <h3 className={styles.featureTitle}>{title}</h3>
      <p className={styles.featureText}>{text}</p>
    </div>
  </div>
)

export const GreenWall: React.FC = () => {
  const features: FeatureProps[] = [
    {
      icon: '🌿',
      title: 'Evergreen Design',
      text: 'Choose shade‑tolerant or sun‑loving plants to keep your wall lush all year round.',
    },
    {
      icon: '📏',
      title: 'Custom Dimensions',
      text: 'Adjust the width and height to fit any space.',
    },
    {
      icon: '💧',
      title: 'Smart Irrigation',
      text: 'Hidden reservoir with silent pump automates watering for up to two weeks.',
    },
    {
      icon: '🔧',
      title: 'Tool‑less Assembly',
      text: 'Tension‑fit frame locks between floor and ceiling—no drilling required.',
    },
  ]

  return (
    <div className={styles.page}>
      {/* HERO */}
      <Banner
        href='/greenwall/landing/img02.jpg'
        content={ BannerContentSecond }
      ></Banner>

      <section>
        <Grid
          images={[
            {src: '/greenwall/landing/img01.jpg'},
            {src: '/greenwall/landing/img02.jpg'},
            {src: '/greenwall/landing/greenwall-animation.mp4'},
            {src: '/greenwall/landing/img04.png'},
            {src: '/greenwall/landing/img05.png'},
          ]}
        >

        </Grid>
      </section>

      {/* FEATURES */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Why VerdeVertical?</h2>
        <div className={styles.featuresGrid}>
          {features.map((f) => (
            <Feature key={f.title} {...f} />
          ))}
        </div>
      </section>

      {/* GALLERY */}
      <section className={styles.gallery}>
        <h2 className={styles.sectionTitle}>Looks great anywhere</h2>
        <div className={styles.galleryGrid}>
          {[1, 2, 3].map((n) => (
            <img
              key={n}
              className={styles.galleryImage}
              src={`https://source.unsplash.com/random/400x600?plants,indoor,${n}`}
              alt="Phytowall in interior"
            />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className={styles.cta}>
        <h2 className={styles.ctaTitle}>
          Ready to grow your own slice of nature?
        </h2>
        <p className={styles.ctaSubtitle}>
          Leave your email and be the first to know when VerdeVertical ships.
        </p>
        <form className={styles.ctaForm}>
          <input
            type="email"
            required
            placeholder="you@example.com"
            className={styles.input}
          />
          <button type="submit" className={styles.button}>
            Notify me
          </button>
        </form>
      </section>
    </div>
  )
}
