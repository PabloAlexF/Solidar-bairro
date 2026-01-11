import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Circle, Marker, Popup } from 'react-leaflet';
import { MapPin, Users, Globe, Building2, Zap, Heart } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default markers in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker icon
const createCustomIcon = (color) => {
  return L.divIcon({
    html: `
      <div style="
        width: 20px;
        height: 20px;
        background: ${color};
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          width: 8px;
          height: 8px;
          background: white;
          border-radius: 50%;
        "></div>
      </div>
    `,
    className: 'custom-marker',
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  });
};

const MapaAlcance = ({ radius, onRadiusChange, userLocation }) => {
  const [mapKey, setMapKey] = useState(0);
  const [animatedRadius, setAnimatedRadius] = useState(radius);
  const [showPulse, setShowPulse] = useState(false);
  
  const defaultLocation = userLocation || { lat: -23.5505, lng: -46.6333 };
  
  // Simulated nearby helpers
  const [nearbyHelpers, setNearbyHelpers] = useState([]);
  
  useEffect(() => {
    // Generate random nearby helpers based on radius
    const helpers = [];
    const helperCount = Math.min(Math.floor(radius / 2) + 2, 8);
    
    for (let i = 0; i < helperCount; i++) {
      const angle = (Math.PI * 2 * i) / helperCount + Math.random() * 0.5;
      const distance = (Math.random() * radius * 0.8 + radius * 0.2) / 111; // Convert km to degrees
      
      helpers.push({
        id: i,
        lat: defaultLocation.lat + Math.cos(angle) * distance,
        lng: defaultLocation.lng + Math.sin(angle) * distance,
        type: ['cidadao', 'comercio', 'ong'][Math.floor(Math.random() * 3)],
        name: ['Maria S.', 'João P.', 'Ana L.', 'Carlos M.', 'Loja do Bairro', 'ONG Esperança'][Math.floor(Math.random() * 6)]
      });
    }
    
    setNearbyHelpers(helpers);
  }, [radius, defaultLocation.lat, defaultLocation.lng]);
  
  useEffect(() => {
    setAnimatedRadius(radius);
    setShowPulse(true);
    const timer = setTimeout(() => setShowPulse(false), 1000);
    return () => clearTimeout(timer);
  }, [radius]);
  
  const getHelperColor = (type) => {
    switch (type) {
      case 'cidadao': return '#10b981';
      case 'comercio': return '#3b82f6';
      case 'ong': return '#6366f1';
      default: return '#f97316';
    }
  };
  
  const getHelperIcon = (type) => {
    switch (type) {
      case 'cidadao': return <Users size={12} />;
      case 'comercio': return <Building2 size={12} />;
      case 'ong': return <Heart size={12} />;
      default: return <MapPin size={12} />;
    }
  };
  
  return (
    <div style={{
      width: '100%',
      height: '400px',
      borderRadius: '20px',
      overflow: 'hidden',
      border: '2px solid #e5e7eb',
      position: 'relative',
      background: '#f8fafc'
    }}>
      {/* Map Controls Overlay */}
      <div style={{
        position: 'absolute',
        top: '16px',
        left: '16px',
        right: '16px',
        zIndex: 1000,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          padding: '8px 16px',
          borderRadius: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '0.875rem',
          fontWeight: '600',
          color: '#374151',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
          <Zap size={14} color="#f97316" />
          Alcance: {radius}km
        </div>
        
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          padding: '8px 16px',
          borderRadius: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '0.875rem',
          fontWeight: '600',
          color: '#374151',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
          <Users size={14} color="#10b981" />
          {nearbyHelpers.length} pessoas próximas
        </div>
      </div>
      
      {/* Radius Control */}
      <div style={{
        position: 'absolute',
        bottom: '16px',
        left: '16px',
        right: '16px',
        zIndex: 1000,
        background: 'rgba(15, 23, 42, 0.9)',
        backdropFilter: 'blur(10px)',
        padding: '16px',
        borderRadius: '16px',
        color: 'white'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '12px'
        }}>
          <span style={{ fontSize: '0.875rem', opacity: 0.8 }}>Ajustar alcance</span>
          <span style={{ fontSize: '1.125rem', fontWeight: '700', color: '#f97316' }}>{radius}km</span>
        </div>
        
        <input
          type="range"
          min="1"
          max="50"
          value={radius}
          onChange={(e) => onRadiusChange(Number(e.target.value))}
          style={{
            width: '100%',
            height: '6px',
            borderRadius: '3px',
            background: 'rgba(255,255,255,0.2)',
            outline: 'none',
            WebkitAppearance: 'none',
            cursor: 'pointer'
          }}
        />
        
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '8px',
          fontSize: '0.75rem',
          opacity: 0.6
        }}>
          <span>1km</span>
          <span>25km</span>
          <span>50km</span>
        </div>
      </div>
      
      <MapContainer
        key={mapKey}
        center={[defaultLocation.lat, defaultLocation.lng]}
        zoom={radius > 20 ? 10 : radius > 10 ? 12 : 14}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
        scrollWheelZoom={false}
        doubleClickZoom={false}
        dragging={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        
        {/* User location marker */}
        <Marker 
          position={[defaultLocation.lat, defaultLocation.lng]}
          icon={createCustomIcon('#f97316')}
        >
          <Popup>
            <div style={{ textAlign: 'center', padding: '8px' }}>
              <strong>Sua localização</strong>
              <br />
              <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                Seu pedido será visível nesta área
              </span>
            </div>
          </Popup>
        </Marker>
        
        {/* Radius circle with animation */}
        <Circle
          center={[defaultLocation.lat, defaultLocation.lng]}
          radius={animatedRadius * 1000} // Convert km to meters
          pathOptions={{
            fillColor: '#f97316',
            fillOpacity: showPulse ? 0.3 : 0.15,
            color: '#f97316',
            weight: showPulse ? 3 : 2,
            opacity: showPulse ? 0.8 : 0.5
          }}
        />
        
        {/* Pulse effect circle */}
        {showPulse && (
          <Circle
            center={[defaultLocation.lat, defaultLocation.lng]}
            radius={animatedRadius * 1000 * 1.2}
            pathOptions={{
              fillColor: '#f97316',
              fillOpacity: 0.1,
              color: '#f97316',
              weight: 1,
              opacity: 0.3
            }}
          />
        )}
        
        {/* Nearby helpers */}
        {nearbyHelpers.map((helper) => (
          <Marker
            key={helper.id}
            position={[helper.lat, helper.lng]}
            icon={createCustomIcon(getHelperColor(helper.type))}
          >
            <Popup>
              <div style={{ textAlign: 'center', padding: '8px' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  marginBottom: '4px'
                }}>
                  {getHelperIcon(helper.type)}
                  <strong>{helper.name}</strong>
                </div>
                <span style={{ 
                  fontSize: '0.75rem', 
                  color: getHelperColor(helper.type),
                  textTransform: 'capitalize',
                  fontWeight: '600'
                }}>
                  {helper.type === 'cidadao' ? 'Cidadão' : 
                   helper.type === 'comercio' ? 'Comércio' : 'ONG'}
                </span>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      
      {/* Legend */}
      <div style={{
        position: 'absolute',
        top: '70px',
        right: '16px',
        zIndex: 1000,
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        padding: '12px',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        fontSize: '0.75rem'
      }}>
        <div style={{ fontWeight: '700', marginBottom: '8px', color: '#374151' }}>Legenda</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f97316' }} />
            <span>Você</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
            <span>Cidadãos</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#3b82f6' }} />
            <span>Comércios</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#6366f1' }} />
            <span>ONGs</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapaAlcance;