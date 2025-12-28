const https = require("https");

function fetchHtml(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = "";
      res.on("data", chunk => (data += chunk));
      res.on("end", () => resolve(data));
    }).on("error", reject);
  });
}

module.exports = async function getSpitzingseeLifts() {
  const url = "https://www.alpenbahnen-spitzingsee.de/lifte-pisten/";

  const html = await fetchHtml(url);

  // sehr robuste Regex
  const match = html.match(/(\d+)\s+von\s+(\d+)\s+Liften\s+geöffnet/i);
  if (!match) {
    throw new Error("Could not parse Spitzingsee lift table");
  }

  return {
    liftsOpen: Number(match[1]),
    liftsTotal: Number(match[2]),
    source: "alpenbahnen-spitzingsee.de",
    status: "website",
    lastUpdated: new Date().toISOString()
  };
};
