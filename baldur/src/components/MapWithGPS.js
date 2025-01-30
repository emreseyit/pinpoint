import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Marker için varsayılan ikonu ayarlamak gerekebilir (Leaflet 3.x sürümlerinde):
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

function MapWithGPS() {
  const [location, setLocation] = useState({ lat: 39.925533, lng: 32.866287 }); // Varsayılan (Ankara)
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      setError("Tarayıcınız geolocation'ı desteklemiyor.");
      setLoading(false);
      return;
    }

    const onSuccess = (position) => {
      const { latitude, longitude } = position.coords;
      setLocation({ lat: latitude, lng: longitude });
      setError(null);
      setLoading(false);
    };

    const onError = (error) => {
      setError(error.message);
      setLoading(false);
    };

    navigator.geolocation.getCurrentPosition(onSuccess, onError);
  }, []);

  return (
    <div style={{ width: "100%", height: "500px" }}>
      {error && <p style={{ color: "red" }}>Hata: {error}</p>}
      {loading && <p>Konum yükleniyor...</p>}
      {!loading && !error && (
        <MapContainer center={[location.lat, location.lng]} zoom={13} style={{ height: "100%", width: "100%" }}>
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[location.lat, location.lng]}>
            <Popup>Şu anda buradasınız.</Popup>
          </Marker>
        </MapContainer>
      )}
    </div>
  );
}

export default MapWithGPS;
