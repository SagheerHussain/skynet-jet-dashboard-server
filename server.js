// server.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const http = require("http");           // ⬅️ NEW
const axios = require("axios");         // ⬅️ NEW
const { dbConnection } = require("./config/config");

const app = express();
const port = process.env.PORT || 5000;

// Mongo DB Connection
dbConnection();

// Middlewares
app.use(cors());
app.use(express.json());

// Entry Point
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Mason Amelia Server" });
});

// Routes
const aircraftRoutes = require("./routes/aircraft.route");
const aircraftCategoryRoutes = require("./routes/aircraftCategory.route");
const brandRoutes = require("./routes/brand.route");
const reviewRoutes = require("./routes/review.route");
const contactRoutes = require("./routes/contact.route");
const teamRoutes = require("./routes/team.route");
const videoRoutes = require("./routes/video.route");
const authRoutes = require("./routes/auth.route");
const authorRoutes = require("./routes/author.route");
const blogRoutes = require("./routes/blog.route");
const blogCategoryRoutes = require("./routes/blogCategory.route");
const analysisRoutes = require("./routes/analysis.route");

app.use("/api/aircrafts", aircraftRoutes);
app.use("/api/aircraftCategories", aircraftCategoryRoutes);
app.use("/api/brands", brandRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/authors", authorRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/blogCategories", blogCategoryRoutes);
app.use("/api/analysis", analysisRoutes);

// Health/Ping route (tum already /api/ping_routes use kar rahe ho,
// agar woh exist karta hai to ye line rehne do; warna simple fallback neeche add hai)
app.use("/api", require("./routes/ping_routes"));

// ---------- Keep-alive for Render (10 minutes) ----------
if (require.main === module && !process.env.VERCEL) {
  const server = http.createServer(app);

  server.listen(port, "0.0.0.0", () => {
    console.log(`Server is running on port ${port}`);

    // Prefer env, else derive from Render's external URL, else localhost:
    const baseFromRender =
      (process.env.RENDER_EXTERNAL_URL || "").replace(/\/$/, "");
    const PING_URL =
      process.env.PING_URL ||
      (baseFromRender ? `${baseFromRender}/api/ping` : `http://localhost:${port}/api/ping`);

    // 10 minutes (override via KEEPALIVE_INTERVAL_MS if you want)
    const intervalMs = Number(process.env.KEEPALIVE_INTERVAL_MS || 10 * 60 * 1000);

    console.log(`[AutoPing] Using ${PING_URL} every ${intervalMs / 60000} min`);

    setInterval(async () => {
      try {
        await axios.get(PING_URL, { timeout: 10_000 });
        console.log(`[AutoPing] ok @ ${new Date().toISOString()}`);
      } catch (err) {
        console.error(`[AutoPing] failed: ${err?.message || err}`);
      }
    }, intervalMs);
  });
}

module.exports = app;
