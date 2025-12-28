import express from "express";
import cors from "cors";

import spitzingsee from "./parsers/spitzingsee.js";
import sudelfeld from "./parsers/sudelfeld.js";
import garmisch from "./parsers/garmisch.js";

const app = express();
app.use(cors());

const PORT = process.env.PORT || 10000;
const CACHE_TTL = 60 * 60 * 1000; // 60 Minuten

const cache = new Map();

async function getCached(key, fetcher) {
  const now = Date.now();
  const cached = cache.get(key);

  if (cached && now - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  const data = await fetcher();
  cache.set(key, { data, timestamp: now });
  return data;
}

// ---- ROUTES ----

app.get("/api/lifts/spitzingsee", async (_, res) => {
  try {
    res.json(await getCached("spitzingsee", spitzingsee));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/lifts/sudelfeld", async (_, res) => {
  try {
    res.json(await getCached("sudelfeld", sudelfeld));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/lifts/garmisch", async (_, res) => {
  try {
    res.json(await getCached("garmisch", garmisch));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---- START ----

app.listen(PORT, () => {
  console.log(`✅ Backend running on port ${PORT}`);
});
