const express = require("express");
const cors = require("cors");

const getSpitzingseeLifts = require("./parsers/spitzingsee");
const { getBrauneckLifts } = require("./parsers/brauneck");

const app = express();
app.use(cors());

/**
 * Health Check
 */
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    service: "skigebiete-backend"
  });
});

/**
 * Spitzingsee
 */
app.get("/api/lifts/spitzingsee", async (req, res) => {
  try {
    const data = await getSpitzingseeLifts();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "spitzingsee_failed",
      message: err.message
    });
  }
});

/**
 * Brauneck
 */
app.get("/api/lifts/brauneck", async (req, res) => {
  try {
    const data = await getBrauneckLifts();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "brauneck_failed",
      message: err.message
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚡 Lift backend running on port ${PORT}`);
});
