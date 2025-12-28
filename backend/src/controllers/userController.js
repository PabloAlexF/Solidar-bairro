const userService = require('../services/userService');

class UserController {
  async getUser(req, res) {
    try {
      const { uid } = req.params;
      const user = await userService.getUserById(uid);
      res.json(user);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  async createUser(req, res) {
    try {
      const user = await userService.createUser(req.body);
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async updateUser(req, res) {
    try {
      const { uid } = req.params;
      const user = await userService.updateUser(uid, req.body);
      res.json(user);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async deleteUser(req, res) {
    try {
      const { uid } = req.params;
      const result = await userService.deleteUser(uid);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new UserController();