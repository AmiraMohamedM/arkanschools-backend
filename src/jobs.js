import { getDb } from "./db.js";
import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadToCloudinary(file) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: "raw", folder: "arkan-cvs" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      },
    );
    Readable.from(file.buffer).pipe(stream);
  });
}

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

  // رفع الـ CV على Cloudinary
  let cvUrl = null;
  if (cvFile) {
    try {
      cvUrl = await uploadToCloudinary(cvFile);
    } catch (err) {
      console.error("Cloudinary upload error:", err);
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
    cvUrl,
    createdAt: new Date(),
    status: "new",
  });

  return { success: true, id: result.insertedId };
}
