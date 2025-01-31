import React, { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import './ResetPasswordPage.css'; // Import CSS for styling
import { API_HOST } from "@/config/app";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function ResetPasswordPage() {
  const query = useQuery();
  const user_id = query.get("user_id");
  const token = query.get("token");
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }
    try {
      await axios.post(`${API_HOST}/api/reset-password/`, {
        new_password: password,
        user_id,
        token
      },{
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setMessage("Password reset successful");
      navigate("/login"); // Route to home page after successful reset
    } catch (error) {
      console.error("Reset password error", error);
      setMessage("Error resetting password");
    }
  };

  return (
    <div className="reset-password-container">
      <h2>Şifreyi Sıfırla</h2>
      <form className="reset-password-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="password">Yeni Şifre:</label>
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
          <label htmlFor="confirmPassword">Yeni Şifreyi Onayla:</label>
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
          className="reset-password-button"
          disabled={!password || password.length < 6 || password !== confirmPassword}
        >
          Şifreyi Sıfırla
        </button>
        {message && <p className="message">{message}</p>}
      </form>
    </div>
  );
}

export default ResetPasswordPage;
