import { getDb } from "./db.js";

export async function saveJobApplication(fields, cvFile) {
  const {
    fullName,
    phone,
    email,
    specialization,
    qualification,
    experienceYears,
    position,
    coverLetter,
  } = fields;

  // Validate required fields
  const required = {
    fullName,
    phone,
    email,
    specialization,
    qualification,
    experienceYears,
  };
  for (const [key, val] of Object.entries(required)) {
    if (!val?.trim()) {
      return { success: false, error: `حقل ${key} مطلوب` };
    }
  }

  const db = await getDb();
  const result = await db.collection("job_applications").insertOne({
    fullName,
    phone,
    email,
    specialization,
    qualification,
    experienceYears: Number(experienceYears),
    position: position || "",
    coverLetter: coverLetter || "",
    cvFileName: cvFile?.originalname || null,
    cvSize: cvFile?.size || null,
    createdAt: new Date(),
    status: "new",
  });

  return { success: true, id: result.insertedId };
}
