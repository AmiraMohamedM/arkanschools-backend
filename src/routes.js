import { Router } from "express";
import { saveMessage, getAllMessages } from "./messages.js";

const router = Router();

// POST /api/contact  — حفظ رسالة جديدة
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

// GET /api/messages  — جلب كل الرسائل (للوحة التحكم لاحقاً)
router.get("/messages", async (req, res) => {
  try {
    const messages = await getAllMessages();
    res.json({ success: true, data: messages });
  } catch (err) {
    console.error("GET /messages error:", err);
    res.status(500).json({ success: false, error: "خطأ في السيرفر" });
  }
});

export default router;
