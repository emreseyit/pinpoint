import React, { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { API_HOST } from '@/config/app';

function GPSLocation() {
  const [location, setLocation] = useState({ lat: null, lng: null });
  const [error, setError] = useState(null);
  const polylineGPSData = useRef([]);

  useEffect(() => {
    if (!navigator.geolocation || typeof navigator.geolocation.getCurrentPosition !== 'function') {
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

    navigator.geolocation.getCurrentPosition(onSuccess, onError);
  }, []);

  useEffect(() => {
    fetch(`${API_HOST}/api/gps-data`)
      .then(response => response.json())
      .then(data => {
        polylineGPSData.current = data.map(point => [point.lat, point.lng]);
        console.log('GPS data:', polylineGPSData.current);
      })
      .catch(error => console.error('Error fetching GPS data:', error));
  }, []);

  return (
    <div>
      <h2>Kullanıcı Konumu</h2>
      {error && <p style={{ color: "red" }}>Hata: {error}</p>}
      {!error && location && location.lat && location.lng ? (
        <>
          <p>
            Enlem: {location.lat}, Boylam: {location.lng}
          </p>
          <MapContainer center={[location.lat, location.lng]} zoom={13} style={{ height: "400px", width: "100%" }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {polylineGPSData.current.length > 0 && (
              <Polyline
                positions={polylineGPSData}
                pathOptions={{ color: 'blue', dashArray: '5, 10' }}
              />
            )}
          </MapContainer>
        </>
      ) : (
        <p>Konum bilgisi alınıyor...</p>
      )}
    </div>
  );
}

export default GPSLocation;
