const axios = require('axios');
const cacheService = require('./cacheService');
const logger = require('./loggerService');

class AddressService {
  constructor() {
    this.viaCepBaseUrl = 'https://viacep.com.br/ws';
    this.fallbackApis = [
      'https://brasilapi.com.br/api/cep/v1',
      'https://cep.awesomeapi.com.br/json'
    ];
    this.timeout = parseInt(process.env.VIACEP_TIMEOUT) || 5000;
    this.fallbackEnabled = process.env.FALLBACK_API_ENABLED === 'true';
  }

  async searchByCep(cep) {
    const startTime = Date.now();
    const cleanCep = cep.replace(/\D/g, '');
    
    try {
      if (cleanCep.length !== 8) {
        throw new Error('CEP deve ter 8 dígitos');
      }

      // Check cache first
      const cacheKey = cacheService.generateKey('cep', cleanCep);
      const cachedResult = await cacheService.get(cacheKey);
      
      if (cachedResult) {
        const responseTime = Date.now() - startTime;
        logger.logViaCepUsage(`/cep/${cleanCep}`, responseTime, true, true);
        return cachedResult;
      }

      // Try ViaCEP first
      let result = await this.tryViaCep(cleanCep);
      
      // If ViaCEP fails and fallback is enabled, try other APIs
      if (!result && this.fallbackEnabled) {
        result = await this.tryFallbackApis(cleanCep);
      }

      if (!result) {
        throw new Error('CEP não encontrado');
      }

      // Cache successful result
      await cacheService.set(cacheKey, result, 86400); // 24 hours
      
      const responseTime = Date.now() - startTime;
      logger.logViaCepUsage(`/cep/${cleanCep}`, responseTime, true, false);
      
      return result;
    } catch (error) {
      const responseTime = Date.now() - startTime;
      logger.logViaCepUsage(`/cep/${cleanCep}`, responseTime, false, false);
      throw new Error(`Erro ao buscar CEP: ${error.message}`);
    }
  }

  async tryViaCep(cep) {
    try {
      const response = await axios.get(`${this.viaCepBaseUrl}/${cep}/json/`, {
        timeout: this.timeout
      });
      
      if (response.data.erro) {
        return null;
      }

      return {
        success: true,
        data: {
          cep: response.data.cep,
          logradouro: response.data.logradouro,
          bairro: response.data.bairro,
          cidade: response.data.localidade,
          estado: response.data.uf,
          complemento: response.data.complemento || '',
          ibge: response.data.ibge
        }
      };
    } catch (error) {
      logger.warn('ViaCEP API failed', { cep, error: error.message });
      return null;
    }
  }

  async tryFallbackApis(cep) {
    for (const apiUrl of this.fallbackApis) {
      try {
        logger.info('Trying fallback API', { api: apiUrl, cep });
        
        let response;
        if (apiUrl.includes('brasilapi')) {
          response = await axios.get(`${apiUrl}/${cep}`, { timeout: this.timeout });
        } else if (apiUrl.includes('awesomeapi')) {
          response = await axios.get(`${apiUrl}/${cep}`, { timeout: this.timeout });
        }

        if (response && response.data && !response.data.erro) {
          logger.info('Fallback API success', { api: apiUrl, cep });
          return this.normalizeApiResponse(response.data);
        }
      } catch (error) {
        logger.warn('Fallback API failed', { api: apiUrl, cep, error: error.message });
        continue;
      }
    }
    return null;
  }

  normalizeApiResponse(data) {
    return {
      success: true,
      data: {
        cep: data.cep,
        logradouro: data.address || data.logradouro || data.street || '',
        bairro: data.district || data.bairro || '',
        cidade: data.city || data.cidade || data.localidade || '',
        estado: data.state || data.estado || data.uf || '',
        complemento: data.complement || data.complemento || '',
        ibge: data.city_ibge || data.ibge || ''
      }
    };
  }

  async searchByAddress(uf, cidade, logradouro) {
    const startTime = Date.now();
    
    try {
      if (!uf || !cidade || !logradouro) {
        throw new Error('UF, cidade e logradouro são obrigatórios');
      }

      if (logradouro.length < 3) {
        throw new Error('Logradouro deve ter pelo menos 3 caracteres');
      }

      // Check cache
      const cacheKey = cacheService.generateKey('address', uf, cidade, logradouro);
      const cachedResult = await cacheService.get(cacheKey);
      
      if (cachedResult) {
        const responseTime = Date.now() - startTime;
        logger.logViaCepUsage(`/address/${uf}/${cidade}/${logradouro}`, responseTime, true, true);
        return cachedResult;
      }

      const response = await axios.get(
        `${this.viaCepBaseUrl}/${uf}/${cidade}/${logradouro}/json/`,
        { timeout: this.timeout }
      );

      if (!Array.isArray(response.data) || response.data.length === 0) {
        const result = { success: true, data: [] };
        await cacheService.set(cacheKey, result, 1800); // 30 minutes
        return result;
      }

      const addresses = response.data.slice(0, 10).map(addr => ({
        cep: addr.cep,
        logradouro: addr.logradouro,
        bairro: addr.bairro,
        cidade: addr.localidade,
        estado: addr.uf,
        complemento: addr.complemento || '',
        ibge: addr.ibge
      }));

      const result = { success: true, data: addresses };
      await cacheService.set(cacheKey, result, 3600); // 1 hour
      
      const responseTime = Date.now() - startTime;
      logger.logViaCepUsage(`/address/${uf}/${cidade}/${logradouro}`, responseTime, true, false);
      
      return result;
    } catch (error) {
      const responseTime = Date.now() - startTime;
      logger.logViaCepUsage(`/address/${uf}/${cidade}/${logradouro}`, responseTime, false, false);
      throw new Error(`Erro ao buscar endereços: ${error.message}`);
    }
  }

  async getNeighborhoods(uf, cidade) {
    const startTime = Date.now();
    
    try {
      if (!uf || !cidade) {
        throw new Error('UF e cidade são obrigatórios');
      }

      // Check cache
      const cacheKey = cacheService.generateKey('neighborhoods', uf, cidade);
      const cachedResult = await cacheService.get(cacheKey);
      
      if (cachedResult) {
        const responseTime = Date.now() - startTime;
        logger.logViaCepUsage(`/neighborhoods/${uf}/${cidade}`, responseTime, true, true);
        return cachedResult;
      }

      const response = await axios.get(
        `${this.viaCepBaseUrl}/${uf}/${cidade}/centro/json/`,
        { timeout: this.timeout }
      );

      if (!Array.isArray(response.data)) {
        const result = { success: true, data: [] };
        await cacheService.set(cacheKey, result, 7200); // 2 hours
        return result;
      }

      const neighborhoods = [...new Set(
        response.data
          .filter(addr => addr.bairro)
          .map(addr => addr.bairro)
      )].slice(0, 20);

      const result = { success: true, data: neighborhoods };
      await cacheService.set(cacheKey, result, 7200); // 2 hours
      
      const responseTime = Date.now() - startTime;
      logger.logViaCepUsage(`/neighborhoods/${uf}/${cidade}`, responseTime, true, false);
      
      return result;
    } catch (error) {
      const responseTime = Date.now() - startTime;
      logger.logViaCepUsage(`/neighborhoods/${uf}/${cidade}`, responseTime, false, false);
      return { success: true, data: [] };
    }
  }
}

module.exports = new AddressService();