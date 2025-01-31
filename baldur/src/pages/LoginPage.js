import React, { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import './LoginPage.css'; // Import CSS for styling
import { API_HOST } from "@/config/app";
import { useUser } from "@/context/UserContext"; // Ensure correct import path
import { useNavigate } from "react-router-dom"; // Import useNavigate

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setCurrentUser } = useUser(); // Ensure useUser is correctly used
  const navigate = useNavigate(); // Initialize useNavigate

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(`${API_HOST}/api/auth/`, {
        username,
        password
      },{
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const { token, user } = response.data;
      // Store token in cookies
      Cookies.set('token', token);
      // Store user credentials in current user store
      setCurrentUser(user);
      // Handle successful login
      navigate("/"); // Route to home page after successful login
    } catch (error) {
      console.error("Login error", error);
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
        <div className="register-link">
          <span>Hesabınız yok mu?</span>
          <a href="/register">Kayıt Ol</a>
        </div>
      </form>
    </div>
  );
}

export default LoginPage;
