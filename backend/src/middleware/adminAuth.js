const jwtUtils = require('../utils/jwt');

const authenticateAdmin = async (req, res, next) => {
  try {
    const token = jwtUtils.extractTokenFromHeader(req.headers.authorization);
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        error: 'Token de acesso requerido' 
      });
    }

    const decoded = jwtUtils.verifyAccessToken(token);
    
    // Verificar se é admin
    if (decoded.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        error: 'Acesso negado. Apenas administradores.' 
      });
    }

    req.user = {
      uid: decoded.id || decoded.uid,
      id: decoded.id,
      role: decoded.role,
      ...decoded
    };
    
    next();
  } catch (error) {
    return res.status(401).json({ 
      success: false, 
      error: 'Token inválido ou expirado' 
    });
  }
};

module.exports = { authenticateAdmin };