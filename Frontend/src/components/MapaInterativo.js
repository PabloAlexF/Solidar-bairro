import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix para ícones do Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapaInterativo = ({ familias = [], pedidos = [] }) => {
  // Coordenadas de Lagoa Santa, MG
  const center = [-19.6319, -43.8894];

  // Bairros com coordenadas aproximadas
  const bairrosCoords = {
    'São Lucas': [-19.6250, -43.8850],
    'Centro': [-19.6319, -43.8894],
    'Vila Nova': [-19.6380, -43.8920],
    'Jardim América': [-19.6290, -43.8800],
    'Santa Rita': [-19.6350, -43.8950]
  };

  const getVulnerabilidadeColor = (vulnerabilidade) => {
    switch (vulnerabilidade) {
      case 'alta': return '#ef4444';
      case 'media': return '#f59e0b';
      case 'baixa': return '#22c55e';
      default: return '#6b7280';
    }
  };

  // Calcular distância entre dois pontos
  const calcularDistancia = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Raio da Terra em km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return (R * c).toFixed(1);
  };

  // Criar ícones personalizados
  const createCustomIcon = (vulnerabilidade) => {
    const color = getVulnerabilidadeColor(vulnerabilidade);
    return L.divIcon({
      className: 'custom-marker',
      html: `
        <div style="
          background: ${color};
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 3px 8px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          color: white;
          font-weight: bold;
        ">👥</div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });
  };

  // Ícone para pedidos de ajuda
  const createPedidoIcon = () => {
    return L.divIcon({
      className: 'pedido-marker',
      html: `
        <div style="
          background: linear-gradient(135deg, #FF7A33, #e66a2b);
          width: 36px;
          height: 36px;
          border-radius: 8px;
          border: 3px solid white;
          box-shadow: 0 4px 12px rgba(255, 122, 51, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 18px;
          font-weight: bold;
          position: relative;
        ">🆘
          <div style="
            position: absolute;
            top: -8px;
            right: -8px;
            background: #ef4444;
            width: 16px;
            height: 16px;
            border-radius: 50%;
            border: 2px solid white;
            animation: pulse 2s infinite;
          "></div>
        </div>
        <style>
          @keyframes pulse {
            0% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.2); opacity: 0.7; }
            100% { transform: scale(1); opacity: 1; }
          }
        </style>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 18]
    });
  };

  return (
    <div style={{ height: '400px', width: '100%', borderRadius: '12px', overflow: 'hidden' }}>
      <MapContainer
        center={center}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {/* Círculos para representar bairros */}
        {Object.entries(bairrosCoords).map(([bairro, coords]) => {
          const familiasNoBairro = familias.filter(f => f.bairro === bairro);
          const radius = Math.max(200, familiasNoBairro.length * 100);
          
          return (
            <Circle
              key={bairro}
              center={coords}
              radius={radius}
              pathOptions={{
                color: '#FF7A33',
                fillColor: '#FF7A33',
                fillOpacity: 0.1,
                weight: 2
              }}
            >
              <Popup>
                <div>
                  <h4>{bairro}</h4>
                  <p>{familiasNoBairro.length} famílias cadastradas</p>
                </div>
              </Popup>
            </Circle>
          );
        })}

        {/* Marcadores para famílias */}
        {familias.map((familia, index) => {
          const bairroCoords = bairrosCoords[familia.bairro];
          if (!bairroCoords) return null;

          const coords = [
            bairroCoords[0] + (Math.random() - 0.5) * 0.01,
            bairroCoords[1] + (Math.random() - 0.5) * 0.01
          ];

          const distancia = calcularDistancia(center[0], center[1], coords[0], coords[1]);

          return (
            <Marker
              key={familia.id}
              position={coords}
              icon={createCustomIcon(familia.vulnerabilidade)}
            >
              <Popup>
                <div>
                  <h4>{familia.nomeCompleto}</h4>
                  <p><strong>Bairro:</strong> {familia.bairro}</p>
                  <p><strong>Pessoas:</strong> {familia.numeroPessoas}</p>
                  <p><strong>Vulnerabilidade:</strong> {familia.vulnerabilidade}</p>
                  <p><strong>Distância:</strong> {distancia} km</p>
                  {familia.criancas > 0 && <p><strong>Crianças:</strong> {familia.criancas}</p>}
                  {familia.idosos > 0 && <p><strong>Idosos:</strong> {familia.idosos}</p>}
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Marcadores para pedidos de ajuda */}
        {pedidos.map((pedido, index) => {
          // Usar coordenadas baseadas no bairro se disponível, senão usar centro
          const bairroCoords = bairrosCoords[pedido.bairro] || center;
          const coords = [
            bairroCoords[0] + (Math.random() - 0.5) * 0.02,
            bairroCoords[1] + (Math.random() - 0.5) * 0.02
          ];

          const distancia = calcularDistancia(center[0], center[1], coords[0], coords[1]);

          return (
            <Marker
              key={`pedido-${pedido.id}`}
              position={coords}
              icon={createPedidoIcon()}
            >
              <Popup>
                <div>
                  <h4>{pedido.titulo}</h4>
                  <p><strong>Tipo:</strong> {pedido.tipo}</p>
                  <p><strong>Urgência:</strong> {pedido.urgencia}</p>
                  <p><strong>Distância:</strong> {distancia} km</p>
                  <p><strong>Usuário:</strong> {pedido.usuario}</p>
                  <p><strong>Tempo:</strong> {pedido.tempo}</p>
                </div>
              </Popup>
            </Marker>
          );
        })}}
      </MapContainer>
    </div>
  );
};

export default MapaInterativo;