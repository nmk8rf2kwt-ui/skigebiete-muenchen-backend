import express from "express";
import cors from "cors";

import brauneck from "./parsers/brauneck.js";
import spitzingsee from "./parsers/spitzingsee.js";

const app = express();
app.use(cors());

app.get("/", (req, res) => {
  res.send("Skigebiete Backend läuft 🚀");
});

app.get("/api/lifts/brauneck", async (req, res) => {
  try {
    const data = await brauneck();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "brauneck_failed", message: err.message });
  }
});

app.get("/api/lifts/spitzingsee", async (req, res) => {
  try {
    const data = await spitzingsee();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "spitzingsee_failed", message: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend läuft auf Port ${PORT}`);
});
