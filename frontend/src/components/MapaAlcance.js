import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Circle, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom orange marker
const orangeIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const MapaAlcance = ({ radius, onRadiusChange }) => {
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          setLocationError('Não foi possível obter sua localização');
          setUserLocation({ lat: -23.5505, lng: -46.6333 });
        }
      );
    } else {
      setLocationError('Geolocalização não suportada');
      setUserLocation({ lat: -23.5505, lng: -46.6333 });
    }
  }, []);

  if (!userLocation) {
    return (
      <div className="map-loading">
        <div className="loading-spinner"></div>
        <p>{locationError || 'Carregando sua localização...'}</p>
      </div>
    );
  }

  return (
    <div className="leaflet-map-container">
      <MapContainer
        center={[userLocation.lat, userLocation.lng]}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        zoomControl={true}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <Marker 
          position={[userLocation.lat, userLocation.lng]} 
          icon={orangeIcon}
        >
          <Popup>
            <div className="map-popup">
              <strong>Sua localização</strong>
              <br />
              Raio de alcance: {radius}km
            </div>
          </Popup>
        </Marker>
        
        <Circle
          center={[userLocation.lat, userLocation.lng]}
          radius={radius * 1000}
          pathOptions={{
            color: '#f97316',
            fillColor: '#f97316',
            fillOpacity: 0.2,
            weight: 3
          }}
        />
      </MapContainer>
      
      <div className="map-controls">
        <div className="radius-display">
          <span>Alcance: {radius}km</span>
        </div>
        <input
          type="range"
          min="1"
          max="20"
          value={radius}
          onChange={(e) => onRadiusChange(parseInt(e.target.value))}
          className="radius-slider"
        />
      </div>
    </div>
  );
};

export default MapaAlcance;