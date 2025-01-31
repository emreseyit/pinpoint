import React, { useState } from "react";
import axios from "axios";
import './RegisterPage.css'; // Import CSS for styling
import { API_HOST } from "@/config/app";

function RegisterPage() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    try {
      await axios.post(
        `${API_HOST}/api/register/`,
        { name, username, password, email },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      // Handle successful registration
      setSuccess(true);
      setName("");
      setUsername("");
      setPassword("");
      setConfirmPassword("");
      setEmail("");
    } catch (error) {
      console.error("There was an error registering!", error);
      // Handle registration error
    }
  };

  return (
    <div className="register-container">
      {success && <div className="success-notification">Kullanıcı başarıyla oluşturuldu!</div>}
      <h2>Kayıt Ol</h2>
      <form className="register-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Ad:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
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
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
        <div className="form-group">
          <label htmlFor="confirmPassword">Şifreyi Onayla:</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="register-button"
          disabled={!name || !username || !email || password.length < 6 || password !== confirmPassword}
        >
          Kayıt Ol
        </button>
      </form>
    </div>
  );
}

export default RegisterPage;
