// index.js
import express from "express";
import cors from "cors";

import spitzingsee from "./parsers/spitzingsee.js";
import brauneck from "./parsers/brauneck.js";

const app = express();
app.use(cors());

const parsers = {
  spitzingsee,
  brauneck
};

app.get("/api/lifts/:slug", async (req, res) => {
  const { slug } = req.params;
  const parser = parsers[slug];

  if (!parser) {
    return res.status(404).json({ error: "unknown_resort" });
  }

  try {
    const data = await parser();
    res.json(data);
  } catch (err) {
    console.error(slug, err.message);
    res.status(500).json({
      error: "parser_failed",
      slug,
      message: err.message
    });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`✅ Backend running on port ${PORT}`);
});
