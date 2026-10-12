import app from '../server/server.js';
import { initMongoConnection, isMongoConnected } from '../server/data/mongoConnection.js';
import { db } from '../server/data/db.js';

let isInitialized = false;

export default async function handler(req, res) {
  if (!isInitialized) {
    try {
      await initMongoConnection();
      if (isMongoConnected()) {
        await db.hydrateFromMongo();
      }
    } catch (e) {
      console.warn('Vercel serverless Mongo init:', e.message);
    }
    isInitialized = true;
  }
  return app(req, res);
}
