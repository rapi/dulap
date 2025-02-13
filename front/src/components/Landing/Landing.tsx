import React from 'react'
import './Landing.css'

export const Landing: React.FC = () => {
  return (
    <div className="landing-page outfit-font">
      <header className="header">
        <div className="logo">
          <img src="/logo.svg" alt="Dulap.md Logo" />
        </div>
        <nav className="navigation">
          <a href="#">Dulapuri</a>
          <a href="#">Comode</a>
          <a href="#">Rafturi</a>
          <button className="cta-button">Încearcă aici</button>
          <div className="icons">
            <span className="icon-cart" />
            <span className="icon-user" />
          </div>
        </nav>
      </header>

      <section className="hero">
        <div className="hero-content">
          <h1>Dulapul tău - exact cum îl vrei</h1>
          <p>
            Mobilier creat după dimensiunile tale <span>preferințele</span>{' '}
            <span>culorile</span>
          </p>
          <button className="customize-button">Personalizează!!</button>
        </div>
        <img
          className="hero-image"
          src="/banner.jpg"
          alt="Hero showcasing furniture"
        />
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
            alt="Familia Grînciuc"
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
