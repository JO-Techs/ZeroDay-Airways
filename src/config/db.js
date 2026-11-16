const { MongoClient } = require('mongodb');

let client;
let db;

async function connect() {
  const mongoUrl = process.env.MONGO_URL || 'mongodb://mongo:27017/zeroday';
  client = new MongoClient(mongoUrl);
  await client.connect();
  db = client.db();
  return db;
}

function getDb() {
  if (!db) {
    throw new Error('Database has not been connected yet.');
  }
  return db;
}

module.exports = { connect, getDb };
