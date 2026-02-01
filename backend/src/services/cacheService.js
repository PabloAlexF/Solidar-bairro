const redis = require('redis');
const logger = require('./loggerService');

class CacheService {
  constructor() {
    this.client = null;
    this.isConnected = false;
    this.defaultTTL = parseInt(process.env.CACHE_TTL) || 3600;
  }

  async connect() {
    // Check if Redis is enabled
    if (process.env.REDIS_ENABLED === 'false') {
      logger.info('Redis disabled by configuration, running without cache');
      this.isConnected = false;
      return false;
    }

    try {
      this.client = redis.createClient({
        url: process.env.REDIS_URL || 'redis://localhost:6379',
        password: process.env.REDIS_PASSWORD || undefined,
        socket: {
          connectTimeout: 5000,
          lazyConnect: true
        }
      });

      this.client.on('error', (err) => {
        logger.error('Redis Client Error:', err);
        this.isConnected = false;
      });

      this.client.on('connect', () => {
        logger.info('Redis Client Connected');
        this.isConnected = true;
      });

      await this.client.connect();
      return true;
    } catch (error) {
      logger.warn('Redis connection failed, continuing without cache:', error.message);
      this.isConnected = false;
      return false;
    }
  }

  async get(key) {
    if (!this.isConnected) return null;
    
    try {
      const data = await this.client.get(key);
      if (data) {
        logger.debug(`Cache hit for key: ${key}`);
        return JSON.parse(data);
      }
      logger.debug(`Cache miss for key: ${key}`);
      return null;
    } catch (error) {
      logger.error('Cache get error:', error);
      return null;
    }
  }

  async set(key, data, ttl = this.defaultTTL) {
    if (!this.isConnected) return false;
    
    try {
      await this.client.setEx(key, ttl, JSON.stringify(data));
      logger.debug(`Cache set for key: ${key}, TTL: ${ttl}s`);
      return true;
    } catch (error) {
      logger.error('Cache set error:', error);
      return false;
    }
  }

  async del(key) {
    if (!this.isConnected) return false;
    
    try {
      await this.client.del(key);
      logger.debug(`Cache deleted for key: ${key}`);
      return true;
    } catch (error) {
      logger.error('Cache delete error:', error);
      return false;
    }
  }

  generateKey(prefix, ...params) {
    return `${prefix}:${params.join(':')}`;
  }

  async disconnect() {
    if (this.client && this.isConnected) {
      await this.client.disconnect();
      this.isConnected = false;
      logger.info('Redis Client Disconnected');
    }
  }
}

module.exports = new CacheService();