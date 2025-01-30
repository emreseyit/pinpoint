import React, { useState } from "react";
import axios from "axios";
import './LoginPage.css'; // Import CSS for styling
import { API_HOST } from "@/config/app";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post(
        `${API_HOST}/api/login/`,
        { username, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      // Handle successful login
    } catch (error) {
      console.error("There was an error logging in!", error);
      // Handle login error
    }
  };

  return (
    <div className="login-container">
      <h2>Giriş Yap</h2>
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Kullanıcı Adı:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Şifre:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <a href="forgot-password" className="forgot-password">
          Şifremi Unuttum
        </a>
        <button
          type="submit"
          className="login-button"
          disabled={!username || password.length < 6}
        >
          Giriş Yap
        </button>
      </form>
    </div>
  );
}

export default LoginPage;
