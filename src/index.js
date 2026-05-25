import express from "express";
import cors from "cors";
import "dotenv/config";
import router from "./routes.js";
import adminRouter from "./admin.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*",
    methods: ["GET", "POST"],
  }),
);
app.use(express.json());

// Routes
app.use("/api", router);

// Health check
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Arkan Schools API is running 🚀" });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
app.use("/api/admin", adminRouter);
