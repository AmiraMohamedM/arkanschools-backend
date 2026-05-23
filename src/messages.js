import { getDb } from "./db.js";

export async function saveMessage(data) {
  const { name, phone, email, stage, message } = data;

  for (const [key, val] of Object.entries({
    name,
    phone,
    email,
    stage,
    message,
  })) {
    if (!val?.trim()) {
      return { success: false, error: `حقل ${key} مطلوب` };
    }
  }

  const db = await getDb();
  const result = await db.collection("messages").insertOne({
    name,
    phone,
    email,
    stage,
    message,
    createdAt: new Date(),
    status: "new",
  });

  return { success: true, id: result.insertedId };
}

export async function getAllMessages() {
  const db = await getDb();
  return db.collection("messages").find({}).sort({ createdAt: -1 }).toArray();
}
