import { MongoClient } from "mongodb";

let client = null;

export async function getDb(dbName = "arkan") {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not defined");

  if (!client) {
    client = new MongoClient(uri, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
    });
    await client.connect();
    console.log("✅ Connected to MongoDB Atlas");
  }

  return client.db(dbName);
}
