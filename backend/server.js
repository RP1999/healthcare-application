// backend/server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";

import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.route.js";
import patientRoutes from "./routes/patient.route.js";
import productRoutes from "./routes/product.route.js"; // keep if you have product endpoints

// ✅ Explicitly load .env from backend folder
const __dirname = path.resolve();
dotenv.config({ path: path.join(__dirname, "backend", ".env") });

const app = express();
const PORT = process.env.PORT || 5001;

/* -------------------------- Global Middleware -------------------------- */

// Parse JSON & URL-encoded bodies
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

// ✅ CORS setup for frontend (http://localhost:5173)
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Quick respond to preflight
app.options("*", cors());

/* ------------------------------ Healthcheck ----------------------------- */
app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    env: process.env.NODE_ENV || "development",
    time: new Date().toISOString(),
  });
});

/* --------------------------------- APIs -------------------------------- */
app.use("/api/auth", authRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/products", productRoutes); // comment/remove if you don't have products

/* ------------------------ Static (Production Only) ----------------------- */
if (process.env.NODE_ENV === "production") {
  const frontendPath = path.join(__dirname, "frontend", "dist");
  app.use(express.static(frontendPath));
  app.get("*", (_req, res) => {
    res.sendFile(path.resolve(frontendPath, "index.html"));
  });
}

/* ---------------------------- Start the App ----------------------------- */
const start = async () => {
  try {
    // ✅ Ensure MONGO_URI exists
    if (!process.env.MONGO_URI) {
      throw new Error(
        "MONGO_URI is missing. Add it to backend/.env (or load dotenv with the correct path)."
      );
    }

    await connectDB(); // uses process.env.MONGO_URI
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
      console.log(`✅ Mongo URI loaded successfully`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err.message);
    process.exit(1);
  }
};

start();
