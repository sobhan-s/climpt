import { Redis } from 'ioredis';
import { env_config_variable } from './env_conig.config.js';

function createRedisClient() {
  const client = new Redis(env_config_variable.REDIS.URL!, {
    maxRetriesPerRequest: 3,
    retryStrategy(times) {
      const delay = Math.min(times * 50, 2000);
      return delay;
    },
  });

  client.on('error', (err) => {
    console.error('Redis Connection error:', err.message);
  });

  client.on('connect', () => {
    console.log('Redis Connected to', env_config_variable.REDIS.REDIS_PORT!);
  });

  return client;
}

export { createRedisClient, Redis };
