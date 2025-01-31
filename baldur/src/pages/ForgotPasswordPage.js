import React, { useState } from "react";
import axios from "axios";
import './ForgotPasswordPage.css'; // Import CSS for styling
import { API_HOST } from "@/config/app";

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post(`${API_HOST}/api/forgot-password/`, {
        email
      },{
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setMessage("Şifre sıfırlama talimatları e-posta adresinize gönderildi.");
    } catch (error) {
      console.error("Forgot password error", error);
      setMessage("Bir hata oluştu. Lütfen tekrar deneyin.");
    }
  };

  return (
    <div className="forgot-password-container">
      <h2>Şifremi Unuttum</h2>
      <form className="forgot-password-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">E-posta Adresi:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="forgot-password-button"
          disabled={!email}
        >
          Gönder
        </button>
        {message && <p className="message">{message}</p>}
      </form>
    </div>
  );
}

export default ForgotPasswordPage;
