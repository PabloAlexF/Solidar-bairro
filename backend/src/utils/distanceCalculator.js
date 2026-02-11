// Função para calcular distância entre duas coordenadas (Haversine)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Raio da Terra em km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

// Formatar distância para exibição
const formatDistance = (distanceKm) => {
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)}m de você`;
  }
  return `${distanceKm.toFixed(1)}km de você`;
};

// Obter coordenadas do endereço do usuário
const getUserCoordinates = async (userData) => {
  if (!userData) return null;

  // Verificar se já tem coordenadas salvas
  if (userData.endereco?.latitude && userData.endereco?.longitude) {
    return {
      lat: userData.endereco.latitude,
      lng: userData.endereco.longitude
    };
  }

  // Tentar obter do endereço completo
  if (userData.endereco) {
    const { logradouro, numero, bairro, cidade, estado, cep } = userData.endereco;
    const address = `${logradouro || ''} ${numero || ''}, ${bairro || ''}, ${cidade || ''} - ${estado || ''}, ${cep || ''}`.trim();
    
    if (address.length > 10) {
      try {
        // Usar serviço de geocoding (Nominatim - OpenStreetMap)
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`,
          { headers: { 'User-Agent': 'SolidarBrasil/1.0' } }
        );
        const data = await response.json();
        
        if (data && data.length > 0) {
          return {
            lat: parseFloat(data[0].lat),
            lng: parseFloat(data[0].lon)
          };
        }
      } catch (error) {
        console.error('Erro ao geocodificar endereço:', error);
      }
    }
  }

  return null;
};

// Calcular distância entre dois usuários
const calculateUserDistance = async (user1Data, user2Data) => {
  try {
    const coords1 = await getUserCoordinates(user1Data);
    const coords2 = await getUserCoordinates(user2Data);

    if (!coords1 || !coords2) {
      return 'Localização não disponível';
    }

    const distance = calculateDistance(coords1.lat, coords1.lng, coords2.lat, coords2.lng);
    return formatDistance(distance);
  } catch (error) {
    console.error('Erro ao calcular distância:', error);
    return 'Erro ao calcular';
  }
};

module.exports = {
  calculateDistance,
  formatDistance,
  getUserCoordinates,
  calculateUserDistance
};
