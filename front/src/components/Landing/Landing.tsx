import React from 'react'
import './Landing.css'
import classes from './Landing.module.css'
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
          <button className="cta-button">
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
          className="hero-image"
          src="/banner-2.jpg"
          alt="Hero showcasing furniture"
        />
        <div className="hero-content">
          <h1>Dulapul tău - </h1>
          <h1>exact cum îl vrei</h1>
          <p className="hero-subtitle">
            Mobilier creat după <span>dimensiunile</span>{' '}
            <span>preferințele</span> <span>culorile</span> tale
          </p>
          {/* <button className="customize-button">Personalizează</button> */}
          <button className="cta-button">
            <img src="/wardrobe-button.svg" alt="Dulap.md Logo" />
            <p className="cta-button-title">Personalizează</p>
          </button>
        </div>
      </section>

      <section className="product-types">
        <h2>
          Alege ce tip de dulap ai nevoie și începe <span>personalizarea!</span>
        </h2>
        <div className="product-grid">
          {[...Array(6)].map((_, index) => (
            <div className="product-card" key={index}>
              <img src="/banner.jpg" alt="Comodă" className="product-image" />
              <h3>Comodă pe picioare</h3>
              <div className="options">
                <span className="color-option" />
                <span className="color-option" />
                <span className="color-option" />
              </div>
              <button className="create-button">Creează</button>
            </div>
          ))}
        </div>
      </section>

      <section className="ready-products">
        <h2>
          Alege <span>produse gata</span> din lista noastră
        </h2>
        <div className="product-list">
          {[...Array(4)].map((_, index) => (
            <div className="ready-product-card" key={index}>
              <img
                src="/banner.jpg"
                alt="Comodă scandi wood"
                className="product-image"
              />
              <h3>Comodă scandi wood</h3>
              <p>1200x400x850mm</p>
              <button className="add-to-cart-button">Adaugă în coș</button>
            </div>
          ))}
        </div>
      </section>

      <section className="about-us">
        <div className="about-content">
          <img
            src="/banner.jpg"
            alt="Familia Grinciuc"
            className="about-image"
          />
          <div>
            <h2>Despre noi</h2>
            <p>
              dulap.md nu este doar un magazin de mobilier. Este povestea unei{' '}
              <span>familii...</span> Totul a început dintr-o nevoie simplă: să
              ne mobilăm casa simplu, clar și gust.
            </p>
            <button className="try-now-button">Încearcă acum</button>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-links">
          <a href="#">Dulapuri</a>
          <a href="#">Comode</a>
          <a href="#">Rafturi</a>
          <a href="#">Despre noi</a>
          <a href="#">Contacte</a>
        </div>
        <div className="social-links">
          <a href="#">
            <span className="icon-instagram" />
          </a>
          <a href="#">
            <span className="icon-facebook" />
          </a>
        </div>
        <p>Chișinău, Republica Moldova</p>
      </footer>
    </div>
  )
}
