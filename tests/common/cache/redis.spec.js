const { expect } = require('chai');
const redis = require("../../../src/common/cache/redis");

describe('🧪 Redis Configuration', () => {
  it('should initialize the Redis client without errors', () => {
    redis.init();

    const redisClient = redis.getClient();
    expect(redisClient).to.exist;
  });
});

describe('🧪 Redis Interaction', () => {
    let redisClient;
  
    beforeEach(() => {
      redis.init();
      redisClient = redis.getClient();
    });
  
    afterEach(() => {
      redisClient.quit();
    });
  
    it('should set and get a key in Redis', async () => {
      const key = 'testKey';
      const value = 'testValue';
  
      await redisClient.setAsync(key, value);
  
      const retrievedValue = await redisClient.getAsync(key);
  
      expect(retrievedValue).to.equal(value);
    });
  
    it('should delete a key in Redis', async () => {
      const key = 'testKey';
      const value = 'testValue';
  
      await redisClient.setAsync(key, value);
      await redisClient.delAsync(key);
  
      const retrievedValue = await redisClient.getAsync(key);
  
      expect(retrievedValue).to.be.null;
    });
  
    it('should expire a key in Redis', async function() {
        this.timeout(5000);
      
        const key = 'testKey';
        const value = 'testValue';
        const expirationTime = 1; // Will set the expiration time of this item to 1s
      
        await redisClient.setAsync(key, value, 'EX', expirationTime);
      
        // Wait for expire
        await new Promise(resolve => setTimeout(resolve, (expirationTime + 1) * 1000));
      
        // Trying to retrieve value
        const retrievedValue = await redisClient.getAsync(key);
      
        expect(retrievedValue).to.be.null;
      });
  });
  
