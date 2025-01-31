import React, { useState, useEffect } from "react";
import { useUser } from '@/context/UserContext';
import axios from 'axios';
import Cookies from 'js-cookie';
import "./Navigator.css";
import { API_HOST } from '@/config/app';

function Navigator() {
  const { isAuthenticated, setCurrentUser, setIsAuthenticated } = useUser();
  const [burgerOpen, setBurgerOpen] = useState(false);
  const [darkTheme, setDarkTheme] = useState(true);

  useEffect(() => {
    document.body.classList.toggle("dark-theme", darkTheme);
  }, [darkTheme]);

  const toggleBurgerMenu = () => {
    setBurgerOpen(!burgerOpen);
  };

  const closeMenu = () => {
    setBurgerOpen(false);
  };

  const toggleTheme = () => {
    setDarkTheme(!darkTheme);
  };

  const handleLogout = () => {
    const token = Cookies.get('token');
    if (token) {
      axios.post(`${API_HOST}/api/logout/`, {
        token
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(() => {
        logout();
        closeMenu();
      })
      .catch(error => {
        if (error.response && error.response.status === 406) {
          console.error('Invalid token:', error);
          logout();
          closeMenu();
          return;
        }
        console.error('Error logging out:', error);
      });
    }
  };

  const logout = () => {
    Cookies.remove('token');
    setCurrentUser(null);
    setIsAuthenticated(false);
  }

  return (
    <div className="navigator-container">
      <div className="burger-icon" onClick={toggleBurgerMenu}>
        <div />
        <div />
        <div />
      </div>

      <nav className={`navigator-menu ${burgerOpen ? "open" : ""}`}>
        <div className="navigator-header">
          <div className="theme-switch-container">
            <label className="theme-switch">
              <input
                type="checkbox"
                checked={!darkTheme}
                onChange={toggleTheme}
              />
              <span className="slider round"></span>
            </label>
            <i className={`mdi ${darkTheme ? 'mdi-weather-night' : 'mdi-weather-sunny'} theme-icon`}></i>
          </div>
          <button className="close-btn" onClick={closeMenu}>
            <i className="mdi mdi-close"></i>
          </button>
        </div>

        <div className="menu-content">
          <div className="navigator-segment top-segment">
            <ul>
              <li onClick={closeMenu}>
                <a href="/">
                  <i className="mdi mdi-map"></i> Harita
                </a>
              </li>
            </ul>
          </div>

          <div className="navigator-segment bottom-segment">
            <ul>
              {isAuthenticated ? (
                <>
                  <li onClick={closeMenu}>
                    <a href="settings">
                      <i className="mdi mdi-cog"></i> Ayarlar
                    </a>
                  </li>
                  <li onClick={handleLogout}>
                    <a href="#">
                      <i className="mdi mdi-logout"></i> Oturumu Kapat
                    </a>
                  </li>
                </>
              ) : (
                <li onClick={closeMenu}>
                  <a href="login">
                    <i className="mdi mdi-login"></i> Giriş
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>

      {burgerOpen && <div className="backdrop" onClick={closeMenu}></div>}
    </div>
  );
}

export default Navigator;
