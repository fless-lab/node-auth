const redis = require('redis');

let redisClient;

function init() {
  redisClient = redis.createClient({
    port: 6379,
    host: '127.0.0.1',
  });

  redisClient.on('connect', () => {
    console.info('Client connected to Redis...');
  });

  redisClient.on('ready', () => {
    console.info('Client connected to Redis and ready to use...');
  });

  redisClient.on('error', (err) => {
    console.error(err.message);
  });

  redisClient.on('end', () => {
    console.warn('Client disconnected from Redis');
  });

  process.on('SIGINT', () => {
    console.log('On client quit');
    redisClient.quit();
  });
}

function getClient() {
  if (!redisClient) {
    throw new Error('Redis client not initialized. Call initRedis() first.');
  }
  return redisClient;
}

module.exports = {
  init,
  getClient,
};
