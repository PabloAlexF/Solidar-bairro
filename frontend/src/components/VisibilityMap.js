import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Circle, Marker, Popup } from 'react-leaflet';
import { useAuth } from '../contexts/AuthContext';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const VisibilityMap = ({ radius, onLocationChange }) => {
  const { user } = useAuth();
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Primeiro, tentar usar localização do usuário cadastrado
    if (user && user.endereco && user.endereco.latitude && user.endereco.longitude) {
      const location = {
        lat: parseFloat(user.endereco.latitude),
        lng: parseFloat(user.endereco.longitude)
      };
      setUserLocation(location);
      setLoading(false);
      onLocationChange?.(location);
      return;
    }

    // Se não tiver localização cadastrada, tentar obter localização atual
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(location);
          setLoading(false);
          onLocationChange?.(location);
        },
        (error) => {
          console.error('Erro ao obter localização:', error);
          // Localização padrão (São Paulo)
          const defaultLocation = { lat: -23.5505, lng: -46.6333 };
          setUserLocation(defaultLocation);
          setLoading(false);
          onLocationChange?.(defaultLocation);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000
        }
      );
    } else {
      // Localização padrão se geolocalização não estiver disponível
      const defaultLocation = { lat: -23.5505, lng: -46.6333 };
      setUserLocation(defaultLocation);
      setLoading(false);
      onLocationChange?.(defaultLocation);
    }
  }, [user, onLocationChange]);

  if (loading) {
    return (
      <div className="map-loading">
        <div className="loading-spinner"></div>
        <p>Obtendo sua localização...</p>
      </div>
    );
  }

  if (!userLocation) {
    return (
      <div className="map-error">
        <p>Não foi possível obter sua localização</p>
      </div>
    );
  }

  return (
    <div className="visibility-map-container">
      <MapContainer
        center={[userLocation.lat, userLocation.lng]}
        zoom={13}
        style={{ height: '100%', width: '100%', borderRadius: '16px' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {/* Marcador da localização do usuário */}
        <Marker position={[userLocation.lat, userLocation.lng]}>
          <Popup>
            <div style={{ textAlign: 'center' }}>
              <strong>Sua localização</strong>
              <br />
              {user && user.endereco ? (
                <small>Baseado no seu endereço cadastrado</small>
              ) : (
                <small>Localização atual detectada</small>
              )}
              <br />
              <small>Seu pedido será visível nesta área</small>
            </div>
          </Popup>
        </Marker>
        
        {/* Círculo mostrando o raio de alcance */}
        <Circle
          center={[userLocation.lat, userLocation.lng]}
          radius={radius * 1000} // Converter km para metros
          pathOptions={{
            color: '#f97316',
            fillColor: '#f97316',
            fillOpacity: 0.1,
            weight: 2
          }}
        />
      </MapContainer>
    </div>
  );
};

export default VisibilityMap;