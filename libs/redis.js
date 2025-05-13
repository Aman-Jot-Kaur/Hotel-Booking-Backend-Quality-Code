// libs/redis.js
const { createClient } = require('redis');

class RedisClient {
  constructor() {
    this.client = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379'
    });
    
    this.client.on('error', (err) => {
      console.error('Redis Error:', err);
    });
    
    this.connect();
  }

  async connect() {
    await this.client.connect();
    console.log('Redis connected successfully');
  }

  async get(key) {
    try {
      const data = await this.client.get(key);
      return data ? JSON.parse(data) : null;
    } catch (err) {
      console.error('Redis GET error:', err);
      return null;
    }
  }

  async set(key, value, ttl = 300) {
    try {
      await this.client.set(key, JSON.stringify(value), {
        EX: ttl // TTL in seconds (default: 5 minutes)
      });
    } catch (err) {
      console.error('Redis SET error:', err);
    }
  }

  async del(key) {
    try {
      await this.client.del(key);
    } catch (err) {
      console.error('Redis DEL error:', err);
    }
  }

  async keys(pattern) {
    try {
      return await this.client.keys(pattern);
    } catch (err) {
      console.error('Redis KEYS error:', err);
      return [];
    }
  }

  async flushAll() {
    try {
      await this.client.flushAll();
    } catch (err) {
      console.error('Redis FLUSHALL error:', err);
    }
  }
}

// Singleton instance
const redis_client = new RedisClient();

module.exports = { redis_client };