import ApiService from '../services/apiService';

// Utility for getting user's real location
export const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocalização não suportada pelo navegador'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const location = await reverseGeocode(latitude, longitude);
          resolve(location);
        } catch (error) {
          console.warn('Erro na geocodificação:', error);
          reject(new Error('Não foi possível identificar sua localização'));
        }
      },
      (error) => {
        let errorMessage = 'Erro ao obter localização';

        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Permissão de localização negada. Você pode ativar nas configurações do navegador.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Localização indisponível no momento.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Tempo limite para obter localização excedido.';
            break;
          default:
            errorMessage = 'Erro desconhecido ao obter localização.';
            break;
        }

        console.warn('Erro de geolocalização:', errorMessage);
        reject(new Error(errorMessage));
      },
      {
        enableHighAccuracy: false,
        timeout: 15000,
        maximumAge: 600000
      }
    );
  });
};

// Reverse geocoding with CORS-free services
const reverseGeocode = async (lat, lon) => {
  // Try multiple geocoding services in order of preference
  const services = [
    // Service 1: Nominatim (more accurate for neighborhoods)
    async () => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1&accept-language=pt-BR`,
          {
            headers: {
              'User-Agent': 'SolidarBrasil/1.0'
            }
          }
        );

        if (!response.ok) {
          throw new Error('Nominatim failed');
        }

        const data = await response.json();

        if (!data || !data.address) {
          throw new Error('Invalid Nominatim data');
        }

        console.log('🗺️ Nominatim address data:', data.address);

        const neighborhood = data.address?.suburb || data.address?.neighbourhood || data.address?.quarter || data.address?.hamlet || data.address?.residential || null;
        
        return {
          city: data.address?.city || data.address?.town || data.address?.village || 'São Paulo',
          state: data.address?.state || 'SP',
          neighborhood: neighborhood && neighborhood !== data.address?.city ? neighborhood : null,
          country: data.address?.country || 'Brasil',
          coordinates: { lat, lon }
        };
      } catch (error) {
        console.warn('Nominatim geocoding failed:', error.message);
        throw error;
      }
    },

    // Service 2: BigDataCloud (fallback)
    async () => {
      try {
        const response = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=pt`
        );

        if (!response.ok) {
          throw new Error('BigDataCloud failed');
        }

        const data = await response.json();

        console.log('🗺️ BigDataCloud data:', data);
        
        const neighborhood = data.localityInfo?.administrative?.[3]?.name || data.localityInfo?.administrative?.[4]?.name || null;
        const city = data.city || data.locality || 'São Paulo';
        
        return {
          city: city,
          state: data.principalSubdivision || 'SP',
          neighborhood: neighborhood && neighborhood !== city ? neighborhood : null,
          country: data.countryName || 'Brasil',
          coordinates: { lat, lon }
        };
      } catch (error) {
        console.warn('BigDataCloud geocoding failed:', error.message);
        throw error;
      }
    }
  ];

  // Try each service until one succeeds
  for (const service of services) {
    try {
      const result = await service();
      if (result) {
        console.log('Geocoding successful');
        return result;
      }
    } catch (error) {
      console.warn('Geocoding service failed:', error.message);
      continue;
    }
  }

  // If all services fail, return basic location
  console.warn('All geocoding services failed, using basic location');
  return {
    city: 'São Paulo',
    state: 'SP',
    neighborhood: null,
    country: 'Brasil',
    coordinates: { lat, lon }
  };
};

// Get default location as fallback
export const getDefaultLocation = () => {
  return {
    city: 'São Paulo',
    state: 'SP',
    neighborhood: null,
    country: 'Brasil',
    coordinates: { lat: -23.5505, lon: -46.6333 }
  };
};

// Get location with fallback
export const getLocationWithFallback = async () => {
  try {
    const location = await getCurrentLocation();
    console.log('Localização obtida com sucesso:', location);
    return location;
  } catch (error) {
    console.warn('Usando localização padrão:', error.message);
    return getDefaultLocation();
  }
};