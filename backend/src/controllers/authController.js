const authService = require('../services/authService');

class AuthController {
  async login(req, res) {
    try {
      const { email, password } = req.body;
      console.log('Login attempt:', { email, password: '***' });

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          error: 'Email e senha são obrigatórios'
        });
      }

      const user = await authService.login(email, password);
      console.log('Login successful for:', email);
      
      res.json({
        success: true,
        data: {
          user,
          message: 'Login realizado com sucesso'
        }
      });
    } catch (error) {
      console.log('Login error:', error.message);
      res.status(401).json({
        success: false,
        error: error.message
      });
    }
  }

  async verifyToken(req, res) {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      
      if (!token) {
        return res.status(401).json({
          success: false,
          error: 'Token não fornecido'
        });
      }

      const decoded = await authService.verifyToken(token);
      const userData = await authService.getUserData(decoded.uid);
      
      res.json({
        success: true,
        data: {
          user: userData,
          uid: decoded.uid
        }
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        error: error.message
      });
    }
  }

  async logout(req, res) {
    res.json({
      success: true,
      message: 'Logout realizado com sucesso'
    });
  }
}

module.exports = new AuthController();