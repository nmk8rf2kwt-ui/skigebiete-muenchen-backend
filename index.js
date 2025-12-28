import express from "express";
import brauneck from "./parsers/brauneck.js";
import spitzingsee from "./parsers/spitzingsee.js";

const app = express();
const PORT = process.env.PORT || 10000;

// In-Memory Cache
const cache = {};
const CACHE_TTL = 60 * 60 * 1000; // 60 Minuten

async function getCached(slug, parser) {
  const now = Date.now();

  if (cache[slug] && now - cache[slug].ts < CACHE_TTL) {
    return cache[slug].data;
  }

  const data = await parser();
  cache[slug] = { data, ts: now };
  return data;
}

app.get("/api/lifts/brauneck", async (req, res) => {
  try {
    const data = await getCached("brauneck", brauneck);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/lifts/spitzingsee", async (req, res) => {
  try {
    const data = await getCached("spitzingsee", spitzingsee);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Backend running on port ${PORT}`);
});
