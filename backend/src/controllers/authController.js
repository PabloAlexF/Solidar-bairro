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

      const result = await authService.login(email, password);
      console.log('Login successful for:', email);
      
      res.json(result);
    } catch (error) {
      console.log('Login error:', error.message);
      res.status(401).json({
        success: false,
        error: error.message
      });
    }
  }

  async refresh(req, res) {
    try {
      const { refreshToken } = req.body;
      
      if (!refreshToken) {
        return res.status(400).json({
          success: false,
          error: 'Refresh token é obrigatório'
        });
      }

      const result = await authService.refreshToken(refreshToken);
      res.json(result);
    } catch (error) {
      console.error('Erro no refresh:', error);
      res.status(401).json({
        success: false,
        error: error.message
      });
    }
  }

  async verify(req, res) {
    try {
      // Token já foi verificado pelo middleware
      res.json({
        success: true,
        data: req.user
      });
    } catch (error) {
      console.error('Erro na verificação:', error);
      res.status(401).json({
        success: false,
        error: error.message
      });
    }
  }

  async logout(req, res) {
    try {
      // JWT é stateless, logout é feito no frontend
      res.json({
        success: true,
        message: 'Logout realizado com sucesso'
      });
    } catch (error) {
      console.error('Erro no logout:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = new AuthController();