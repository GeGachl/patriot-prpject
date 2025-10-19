import "leaflet/dist/leaflet.css";
import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

export default function MapLeaflet({ lat = 53.9, lng = 27.5667, zoom = 12 }) {
  return (
    <div className="map-wrapper" aria-hidden="false">
      <MapContainer center={[lat, lng]} zoom={zoom} style={{ height: "100%", width: "100%" }} scrollWheelZoom={true}>
        <TileLayer
          attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[lat, lng]}>
          <Popup>Здесь находимся мы</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
