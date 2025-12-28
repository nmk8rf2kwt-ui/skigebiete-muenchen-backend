import express from "express";
import cors from "cors";

import { spitzingsee } from "./parsers/spitzingsee.js";
import { brauneck } from "./parsers/brauneck.js";
import { sudelfeld } from "./parsers/sudelfeld.js";
import { garmisch } from "./parsers/garmisch.js";

const app = express();
app.use(cors());

const PORT = process.env.PORT || 10000;

// Health check
app.get("/", (req, res) => {
  res.json({ status: "ok", service: "skigebiete-backend" });
});

// API
app.get("/api/lifts/:resort", async (req, res) => {
  try {
    const { resort } = req.params;

    const parsers = {
      spitzingsee,
      brauneck,
      sudelfeld,
      garmisch
    };

    if (!parsers[resort]) {
      return res.status(404).json({ error: "Unknown resort" });
    }

    const data = await parsers[resort]();

    if (!data || data.liftsTotal === 0) {
      return res.status(503).json({
        error: `${resort} parsing returned zero lifts`
      });
    }

    res.json({
      ...data,
      lastUpdated: new Date().toISOString()
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal parser error" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Backend running on port ${PORT}`);
});
