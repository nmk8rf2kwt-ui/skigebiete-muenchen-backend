import express from "express";
import { brauneck } from "./parsers/brauneck.js";
import { spitzingsee } from "./parsers/spitzingsee.js";

const app = express();
const PORT = process.env.PORT || 3000;

/**
 * Health Check
 */
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    service: "skigebiete-muenchen-backend",
    timestamp: new Date().toISOString()
  });
});

/**
 * Brauneck
 */
app.get("/api/lifts/brauneck", async (req, res) => {
  try {
    const data = await brauneck();
    res.json(data);
  } catch (err) {
    res.status(500).json({
      error: "brauneck_failed",
      message: err.message
    });
  }
});

/**
 * Spitzingsee
 */
app.get("/api/lifts/spitzingsee", async (req, res) => {
  try {
    const data = await spitzingsee();
    res.json(data);
  } catch (err) {
    res.status(500).json({
      error: "spitzingsee_failed",
      message: err.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Backend running on port ${PORT}`);
});
