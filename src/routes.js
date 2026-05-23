import { Router } from "express";
import { saveMessage, getAllMessages } from "./messages.js";
import multer from "multer";
import { saveJobApplication } from "./jobs.js";

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = [".pdf", ".doc", ".docx"];
    const ok = allowed.some((ext) =>
      file.originalname.toLowerCase().endsWith(ext),
    );
    cb(null, ok);
  },
});

// POST /api/contact
router.post("/contact", async (req, res) => {
  try {
    const result = await saveMessage(req.body);
    if (!result.success) {
      return res.status(400).json(result);
    }
    res.status(201).json(result);
  } catch (err) {
    console.error("POST /contact error:", err);
    res.status(500).json({ success: false, error: "خطأ في السيرفر" });
  }
});

// GET /api/messages
router.get("/messages", async (req, res) => {
  try {
    const messages = await getAllMessages();
    res.json({ success: true, data: messages });
  } catch (err) {
    console.error("GET /messages error:", err);
    res.status(500).json({ success: false, error: "خطأ في السيرفر" });
  }
});

// POST /api/jobs/apply
router.post("/jobs/apply", upload.single("cv"), async (req, res) => {
  try {
    const result = await saveJobApplication(req.body, req.file);
    if (!result.success) {
      return res.status(400).json(result);
    }
    res.status(201).json(result);
  } catch (err) {
    console.error("POST /jobs/apply error:", err);
    res.status(500).json({ success: false, error: "خطأ في السيرفر" });
  }
});

export default router;
