import { Router } from "express";
import { signAdminToken, requireAdmin } from "./middleware/auth.js";
import { getDb } from "./db.js";
import { ObjectId } from "mongodb";

const router = Router();

// POST /api/admin/login
router.post("/login", (req, res) => {
  const { email, password } = req.body || {};
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    return res
      .status(500)
      .json({ success: false, message: "بيانات المدير غير مهيأة" });
  }
  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "البريد وكلمة المرور مطلوبة" });
  }
  if (
    email.trim().toLowerCase() !== ADMIN_EMAIL.toLowerCase() ||
    password !== ADMIN_PASSWORD
  ) {
    return res
      .status(401)
      .json({ success: false, message: "بيانات الدخول غير صحيحة" });
  }

  const token = signAdminToken({ role: "admin", email: ADMIN_EMAIL });
  return res.json({ success: true, data: { token, email: ADMIN_EMAIL } });
});

// GET /api/admin/me
router.get("/me", requireAdmin, (req, res) => {
  res.json({
    success: true,
    data: { email: req.admin.email, role: req.admin.role },
  });
});

// GET /api/admin/stats
router.get("/stats", requireAdmin, async (_req, res) => {
  try {
    const db = await getDb();
    const [formsCount, jobsCount] = await Promise.all([
      db.collection("messages").countDocuments(),
      db.collection("job_applications").countDocuments(),
    ]);
    const [latestForm] = await db
      .collection("messages")
      .find()
      .sort({ createdAt: -1 })
      .limit(1)
      .toArray();
    const [latestJob] = await db
      .collection("job_applications")
      .find()
      .sort({ createdAt: -1 })
      .limit(1)
      .toArray();
    res.json({
      success: true,
      data: {
        formsCount,
        jobsCount,
        lastFormAt: latestForm?.createdAt || null,
        lastJobAt: latestJob?.createdAt || null,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/admin/forms
router.get("/forms", requireAdmin, async (_req, res) => {
  try {
    const db = await getDb();
    const forms = await db
      .collection("messages")
      .find()
      .sort({ createdAt: -1 })
      .limit(500)
      .toArray();
    res.json({ success: true, count: forms.length, data: forms });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/admin/forms/:id
router.delete("/forms/:id", requireAdmin, async (req, res) => {
  try {
    const db = await getDb();
    await db
      .collection("messages")
      .deleteOne({ _id: new ObjectId(req.params.id) });
    res.json({ success: true, message: "تم الحذف" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/admin/jobs
router.get("/jobs", requireAdmin, async (_req, res) => {
  try {
    const db = await getDb();
    const jobs = await db
      .collection("job_applications")
      .find()
      .sort({ createdAt: -1 })
      .limit(500)
      .toArray();
    res.json({ success: true, count: jobs.length, data: jobs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/admin/jobs/:id
router.delete("/jobs/:id", requireAdmin, async (req, res) => {
  try {
    const db = await getDb();
    await db
      .collection("job_applications")
      .deleteOne({ _id: new ObjectId(req.params.id) });
    res.json({ success: true, message: "تم الحذف" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
