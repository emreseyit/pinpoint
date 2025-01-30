import React, { useEffect, useState } from "react";

function GPSLocation() {
  const [location, setLocation] = useState({ lat: null, lng: null });
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      setError("Tarayıcınız geolocation özelliğini desteklemiyor.");
      return;
    }

    const onSuccess = (position) => {
      const { latitude, longitude } = position.coords;
      setLocation({ lat: latitude, lng: longitude });
      setError(null);
    };

    const onError = (err) => {
      setError(err.message);
    };

    // Tek seferlik konum alma
    navigator.geolocation.getCurrentPosition(onSuccess, onError);

    // Sürekli takip etmek isterseniz, getCurrentPosition yerine watchPosition kullanabilirsiniz:
    // const watchId = navigator.geolocation.watchPosition(onSuccess, onError);
    // return () => navigator.geolocation.clearWatch(watchId);

  }, []);

  return (
    <div>
      <h2>Kullanıcı Konumu</h2>
      {error && <p style={{ color: "red" }}>Hata: {error}</p>}
      {!error && location.lat && location.lng ? (
        <p>
          Enlem: {location.lat}, Boylam: {location.lng}
        </p>
      ) : (
        <p>Konum bilgisi alınıyor...</p>
      )}
    </div>
  );
}

export default GPSLocation;
