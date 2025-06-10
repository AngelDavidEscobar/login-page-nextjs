// lib/db.ts
import { MongoClient } from 'mongodb';

let client: MongoClient;

export async function connectToDatabase(): Promise<MongoClient> {
  if (!client) {
    client = await MongoClient.connect(process.env.MONGODB_URI as string);
  }
  return client;
}
