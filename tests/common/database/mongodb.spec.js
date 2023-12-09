const { expect } = require('chai');
const mongodb = require('../../../src/common/database/mongodb');

const uri = 'mongodb://localhost:27017/test';
const dbName = 'test';

describe('🧪 MongoDB Connections', () => {

  let db;

  beforeEach(async () => {   
    await mongodb.close();  //Ensure there is no active connection already espablished
    await mongodb.init(uri, dbName);
    db = await mongodb.getClient();
  });

  afterEach(async () => {
    // db = await mongodb.close();
  });

  it('connects without error', async () => {
    expect(db.readyState).to.equal(1);
  });
});