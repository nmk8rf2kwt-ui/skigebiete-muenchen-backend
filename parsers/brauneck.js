const cheerio = require("cheerio");

async function fetchHtml(url) {
  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0",
      "Accept-Language": "de-DE,de;q=0.9"
    }
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.text();
}

async function getBrauneckLifts() {
  const url =
    "https://www.brauneck-bergbahn.de/skigebiet/lifte-pisten";

  const html = await fetchHtml(url);
  const $ = cheerio.load(html);

  let open = 0;
  let total = 0;

  /**
   * Jede Lift-Kachel enthält Status-Text
   * Wir zählen bewusst tolerant
   */
  $(".lift, .lift-item, .bahn, .status").each((_, el) => {
    const text = $(el).text().toLowerCase();

    if (
      text.includes("in betrieb") ||
      text.includes("geöffnet")
    ) {
      open++;
      total++;
    } else if (
      text.includes("außer betrieb") ||
      text.includes("geschlossen")
    ) {
      total++;
    }
  });

  /* Fallback über Body-Text */
  if (total === 0) {
    const body = $("body").text().toLowerCase();
    const openCount =
      (body.match(/in betrieb|geöffnet/g) || []).length;
    const closedCount =
      (body.match(/außer betrieb|geschlossen/g) || []).length;

    if (openCount + closedCount > 0) {
      open = openCount;
      total = openCount + closedCount;
    }
  }

  if (total === 0) {
    throw new Error("No lift status found");
  }

  return {
    liftsOpen: open,
    liftsTotal: total,
    source: "brauneck-bergbahn.de",
    status: "website",
    url
  };
}

module.exports = { getBrauneckLifts };
