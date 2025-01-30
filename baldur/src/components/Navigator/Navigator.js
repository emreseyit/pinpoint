import React, { useState, useEffect } from "react";
import "./Navigator.css";

function Navigator() {
  // Menü açık/kapalı durumunu takip eder
  const [burgerOpen, setBurgerOpen] = useState(false);

  // Koyu/Açık tema durumunu takip eder (varsayılan koyu tema)
  const [darkTheme, setDarkTheme] = useState(true);

  // Tema değiştiğinde body'ye "dark-theme" sınıfını ekleyip çıkarır
  useEffect(() => {
    document.body.classList.toggle("dark-theme", darkTheme);
  }, [darkTheme]);

  // Burger menüyü açıp kapatan fonksiyon
  const toggleBurgerMenu = () => {
    setBurgerOpen(!burgerOpen);
  };

  // Menüde herhangi bir linke tıklandığında veya kapatma tuşuna basıldığında menüyü kapatır
  const closeMenu = () => {
    setBurgerOpen(false);
  };

  // Tema değiştirme fonksiyonu
  const toggleTheme = () => {
    setDarkTheme(!darkTheme);
  };

  return (
    <div className="navigator-container">
      {/* Burger ikonu */}
      <div className="burger-icon" onClick={toggleBurgerMenu}>
        <div />
        <div />
        <div />
      </div>

      {/* Sol taraftan kayan menü */}
      <nav className={`navigator-menu ${burgerOpen ? "open" : ""}`}>
        {/* Menü içi kapatma tuşu */}
        <button className="close-btn" onClick={closeMenu}>
          ✕
        </button>

        <div className="menu-content">
          {/* Üst segment */}
          <div className="navigator-segment top-segment">
            <ul>
              <li onClick={closeMenu}>
                <a href="/">Harita</a>
              </li>
            </ul>
          </div>

          {/* Alt segment */}
          <div className="navigator-segment bottom-segment">
            <ul>
              <li onClick={closeMenu}>
                <a href="settings">Ayarlar</a>
              </li>
              <li onClick={closeMenu}>
                <a href="logout">Oturumu Kapat</a>
              </li>
              <li onClick={closeMenu}>
                <a href="login">Giriş</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Tema değiştirme switch'i (navigatörün en alt sağ köşesinde) */}
        <div className="theme-switch-container">
          <label className="theme-switch">
            {/* checked={!darkTheme} derseniz, switch pozisyonunu ışık/karanlık duruma göre ayarlayabilirsiniz */}
            <input
              type="checkbox"
              checked={!darkTheme}
              onChange={toggleTheme}
            />
            <span className="slider round"></span>
          </label>
        </div>
      </nav>

      {/* Menü açıkken arka planı tıklayınca kapatmak için backdrop eklemek isterseniz: */}
      {burgerOpen && <div className="backdrop" onClick={closeMenu}></div>}
    </div>
  );
}

export default Navigator;
