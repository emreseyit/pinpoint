import React from "react";
import MapWithGPS from "../components/MapWithGPS";
import GPSLocation from "../components/GPSLocation";

function MapPage() {
  return (
    <div>
      <h2>Harita</h2>
        <MapWithGPS />
        <GPSLocation />
    </div>
  );
}

export default MapPage;
