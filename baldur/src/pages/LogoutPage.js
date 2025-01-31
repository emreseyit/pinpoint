import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function LogoutPage() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/login");
  }, [navigate]);

  return (
    <div>
      <h2>Oturumu Kapat</h2>
      <p>Oturum kapatılıyor, lütfen bekleyin...</p>
    </div>
  );
}

export default LogoutPage;
