import React from 'react'
import './Landing.css'
import classes from './Landing.module.css'
// import Image from 'next/image'
export const Landing: React.FC = () => {
  return (
    <div className="landing-page outfit-font">
      <header className={classes.header}>
        <div className="logo">
          <img src="/logo.svg" alt="Dulap.md Logo" />
        </div>
        <nav className="navigation">
          <a href="#">Dulapuri</a>
          <a href="#">Comode</a>
          <a href="#">Rafturi</a>
          <button className="ctaButton">
            <img src="/wardrobe-button.svg" alt="Dulap.md Logo" />
            <p>Încearcă aici</p>
          </button>
          <div className="icons">
            <img src="/cart.svg" alt="Dulap.md shopping cart" />
          </div>
        </nav>
      </header>

      <section className="hero">
        <img
          className="heroImage"
          src="/banner-2.jpg"
          alt="Hero showcasing furniture"
        />
        <div className="heroContent">
          <h1>Dulapul tău - </h1>
          <h1>exact cum îl vrei</h1>
          <p className="heroSubtitle">
            Mobilier creat după <span>dimensiunile</span>{' '}
            <span>preferințele</span> <span>culorile</span> tale
          </p>
          {/* <button className="customize-button">Personalizează</button> */}
          <button className="ctaButton">
            <img src="/wardrobe-button.svg" alt="Dulap.md Logo" />
            <p className="cta-button-title">Personalizează</p>
          </button>
        </div>
      </section>

      <section className={classes.productTypes}>
        <h3 className={classes.productTypesSubtitle}>
          Alege ce tip de dulap ai nevoie și începe personalizarea!
        </h3>
        <div className={classes.productGrid}>
          {[...Array(6)].map((_, index) => (
            <div className={classes.productCard} key={index}>
              <img src="/banner.jpg" alt="Comodă" className="productImage" />
              <h3>Comodă pe picioare</h3>
              <div className="options">
                <span className="colorOption" />
                <span className="colorOption" />
                <span className="colorOption" />
              </div>
              <button className={classes.createButton}>
                <span className={classes.wardrobeIcon2}></span>
                <p className="cta-button-title">Creează</p>
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className={classes.readyProducts}>
        <h2>
          Alege <span>produse gata</span> din lista noastră
        </h2>
        <div className={classes.productList}>
          {[...Array(4)].map((_, index) => (
            <div className="ready-product-card" key={index}>
              <img
                src="/banner.jpg"
                alt="Comodă scandi wood"
                className="productImage"
              />
              <h3>Comodă scandi wood</h3>
              <p>1200x400x850mm</p>
              <button className={classes.addToCartButton}>
                <span className={classes.cartIcon}></span>
                <p className="cta-button-title">Adaugă în coș</p>
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className={classes.aboutUs}>
        <div className="aboutContent">
          <img
            src="/banner.jpg"
            alt="Familia Grinciuc"
            className="aboutImage"
          />
          <div>
            <h2>Despre noi</h2>
            <p>
              dulap.md nu este doar un magazin de mobilier. Este povestea unei{' '}
              <span>familii...</span> Totul a început dintr-o nevoie simplă: să
              ne mobilăm casa simplu, clar și gust.
            </p>
            <button className="tryNowButton">Încearcă acum</button>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="footerLinks">
          <a href="#">Dulapuri</a>
          <a href="#">Comode</a>
          <a href="#">Rafturi</a>
          <a href="#">Despre noi</a>
          <a href="#">Contacte</a>
        </div>
        <div className="socialLinks">
          <a href="#">
            <span className="iconInstagram" />
          </a>
          <a href="#">
            <span className="iconFacebook" />
          </a>
        </div>
        <p>Chișinău, Republica Moldova</p>
      </footer>
    </div>
  )
}
