"use client";
import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix leaflet icon issue in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export default function MapComponent({ emergencies }: { emergencies: any[] }) {
  // Center roughly on India or dynamically based on first emergency
  const defaultCenter: [number, number] = [20.5937, 78.9629];
  const center = emergencies.length > 0 && emergencies[0].latestLocation 
    ? [emergencies[0].latestLocation.latitude, emergencies[0].latestLocation.longitude] 
    : defaultCenter;

  return (
    <MapContainer center={center as [number, number]} zoom={emergencies.length > 0 ? 12 : 5} style={{ height: '400px', width: '100%', borderRadius: '8px' }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {emergencies.map((session) => {
        if (!session.latestLocation) return null;
        return (
          <Marker 
            key={session._id} 
            position={[session.latestLocation.latitude, session.latestLocation.longitude]}
            icon={session.status === 'ACTIVE' ? redIcon : new L.Icon.Default()}
          >
            <Popup>
              <strong>{session.user?.name || 'Unknown'}</strong><br/>
              Phone: {session.user?.phone || 'N/A'}<br/>
              Status: {session.status}<br/>
              Source: {session.triggerSource}
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
