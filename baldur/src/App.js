import React from "react";
import { Routes, Route } from "react-router-dom";
import Navigator from "./components/Navigator/Navigator";
// Page Components
import MapPage from "./pages/MapPage";
import SettingsPage from "./pages/SettingsPage";
import LoginPage from "./pages/LoginPage";
import LogoutPage from "./pages/LogoutPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";

function App() {
  return (
    <div>
      <Navigator />

      <div style={{ marginLeft: "70px", padding: "20px" }}>
        <Routes>
          <Route path="/" element={<MapPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/logout" element={<LogoutPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          {/* TODO: Add 404 page. */}
          {/* 404 durumları için bir NotFound sayfası eklemek isterseniz */}
          {/* <Route path="*" element={<NotFoundPage />} /> */}
        </Routes>
      </div>
    </div>
  );
}

export default App;
