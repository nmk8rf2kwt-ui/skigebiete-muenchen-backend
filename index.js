import express from "express";
import cors from "cors";

import { spitzingsee } from "./parsers/spitzingsee.js";
import { brauneck } from "./parsers/brauneck.js";

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

/* Health check */
app.get("/", (req, res) => {
  res.json({ status: "ok", service: "skigebiete-backend" });
});

/* Lift APIs */
app.get("/api/lifts/spitzingsee", async (req, res) => {
  try {
    const data = await spitzingsee();
    res.json(data);
  } catch (err) {
    console.error("Spitzingsee error:", err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/lifts/brauneck", async (req, res) => {
  try {
    const data = await brauneck();
    res.json(data);
  } catch (err) {
    console.error("Brauneck error:", err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Backend running on port ${PORT}`);
});
