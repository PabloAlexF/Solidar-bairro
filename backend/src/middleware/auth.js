const jwtUtils = require('../utils/jwt');

const authenticateToken = async (req, res, next) => {
  try {
    const token = jwtUtils.extractTokenFromHeader(req.headers.authorization);
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        error: 'Token de acesso requerido' 
      });
    }

    const decoded = jwtUtils.verifyAccessToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ 
      success: false, 
      error: 'Token inválido ou expirado' 
    });
  }
};

const optionalAuth = (req, res, next) => {
  try {
    const token = jwtUtils.extractTokenFromHeader(req.headers.authorization);
    
    if (token) {
      const decoded = jwtUtils.verifyAccessToken(token);
      req.user = decoded;
    }
    
    next();
  } catch (error) {
    // Token inválido, mas continua sem autenticação
    next();
  }
};

module.exports = { authenticateToken, optionalAuth };