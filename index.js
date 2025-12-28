import express from "express";
import { brauneck } from "./parsers/brauneck.js";
import { spitzingsee } from "./parsers/spitzingsee.js";

const app = express();
const PORT = process.env.PORT || 3000;

/* =========================
   Cache (60 Minuten)
========================= */
const CACHE_TTL = 60 * 60 * 1000;
const cache = new Map();

async function withCache(key, fn) {
  const now = Date.now();
  const cached = cache.get(key);

  if (cached && now - cached.time < CACHE_TTL) {
    return cached.data;
  }

  const data = await fn();
  cache.set(key, { time: now, data });
  return data;
}

/* =========================
   Normalizer
========================= */
function normalize({ resort, liftsOpen, liftsTotal, source, status }) {
  return {
    resort,
    slug: resort.toLowerCase(),
    lifts: {
      open: liftsOpen,
      total: liftsTotal
    },
    source,
    status,
    lastUpdated: new Date().toISOString()
  };
}

/* =========================
   Routes
========================= */
app.get("/api/lifts/brauneck", async (_, res) => {
  const data = await withCache("brauneck", brauneck);
  res.json(normalize(data));
});

app.get("/api/lifts/spitzingsee", async (_, res) => {
  const data = await withCache("spitzingsee", spitzingsee);
  res.json(normalize(data));
});

app.listen(PORT, () => {
  console.log(`✅ Backend running on port ${PORT}`);
});
