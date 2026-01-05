import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth_routes.js";
import mapsRoutes from "./routes/maps_routes.js";
import pointsRoutes from "./routes/points_routes.js";

dotenv.config();

const app = express();

app.use(cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:5173",
}));

app.use(express.json());

app.use("/api", authRoutes);
app.use("/api", mapsRoutes);
app.use("/api", pointsRoutes);

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

export default app;
