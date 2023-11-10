const mongoose = require('mongoose');

let mongoClient;

async function connect(uri, dbName) {
  return new Promise((resolve, reject) => {
    mongoose.connect(uri, { dbName })
      .then(() => {
        mongoClient = mongoose.connection;
        console.info('Mongoose connected to db');
        resolve();
      })
      .catch(err => reject(err));
  });
}

async function init(uri = process.env.MONGODB_URI, dbName = process.env.DB_NAME) {
  try {
    await connect(uri, dbName);
    console.info('Mongodb initialised.');
  } catch (err) {
    console.error('Connection error:', err);
    throw err;  
  }
}

async function getClient() {
  if (!mongoClient) {
    throw new Error('Connection not initialized. Call init() first.');
  }

  return mongoClient;
}

async function close() {
  if (mongoClient) {
    await mongoClient.close();
    console.warn('Mongoose connection is disconnected.');
  }
}

module.exports = {
  init,
  getClient,
  close
}
