const addressService = require('../services/addressService');
const logger = require('../services/loggerService');

class AddressController {
  async searchByCep(req, res) {
    const startTime = Date.now();
    
    try {
      const { cep } = req.params;
      const result = await addressService.searchByCep(cep);
      
      const responseTime = Date.now() - startTime;
      logger.logAddressRequest('GET', `/address/cep/${cep}`, { cep }, responseTime, true);
      
      res.json(result);
    } catch (error) {
      const responseTime = Date.now() - startTime;
      logger.logAddressRequest('GET', `/address/cep/${req.params.cep}`, { cep: req.params.cep }, responseTime, false);
      logger.error('CEP search error', { cep: req.params.cep, error: error.message });
      
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  async searchByAddress(req, res) {
    const startTime = Date.now();
    
    try {
      const { uf, cidade, logradouro } = req.query;
      const result = await addressService.searchByAddress(uf, cidade, logradouro);
      
      const responseTime = Date.now() - startTime;
      logger.logAddressRequest('GET', '/address/search', { uf, cidade, logradouro }, responseTime, true);
      
      res.json(result);
    } catch (error) {
      const responseTime = Date.now() - startTime;
      logger.logAddressRequest('GET', '/address/search', req.query, responseTime, false);
      logger.error('Address search error', { query: req.query, error: error.message });
      
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  async getNeighborhoods(req, res) {
    const startTime = Date.now();
    
    try {
      const { uf, cidade } = req.query;
      const result = await addressService.getNeighborhoods(uf, cidade);
      
      const responseTime = Date.now() - startTime;
      logger.logAddressRequest('GET', '/address/neighborhoods', { uf, cidade }, responseTime, true);
      
      res.json(result);
    } catch (error) {
      const responseTime = Date.now() - startTime;
      logger.logAddressRequest('GET', '/address/neighborhoods', req.query, responseTime, false);
      logger.error('Neighborhoods search error', { query: req.query, error: error.message });
      
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = new AddressController();