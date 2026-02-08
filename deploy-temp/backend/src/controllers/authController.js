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

  async requestEmailChange(req, res) {
    try {
      const { userId } = req.params;
      const { newEmail } = req.body;

      if (!newEmail || !newEmail.includes('@')) {
        return res.status(400).json({
          success: false,
          error: 'Email inválido'
        });
      }

      // Verificar se o usuário autenticado é o mesmo que está fazendo a solicitação
      if (req.user.id !== userId) {
        return res.status(403).json({
          success: false,
          error: 'Acesso negado'
        });
      }

      const result = await authService.sendConfirmationCode(userId, newEmail);
      res.json(result);
    } catch (error) {
      console.error('Erro ao solicitar mudança de email:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async confirmEmailChange(req, res) {
    try {
      const { userId } = req.params;
      const { newEmail, code } = req.body;

      if (!newEmail || !code) {
        return res.status(400).json({
          success: false,
          error: 'Email e código são obrigatórios'
        });
      }

      // Verificar se o usuário autenticado é o mesmo que está fazendo a solicitação
      if (req.user.id !== userId) {
        return res.status(403).json({
          success: false,
          error: 'Acesso negado'
        });
      }

      const result = await authService.verifyConfirmationCode(userId, newEmail, code);
      res.json(result);
    } catch (error) {
      console.error('Erro ao confirmar mudança de email:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = new AuthController();