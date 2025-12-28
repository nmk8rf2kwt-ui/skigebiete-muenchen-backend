// backend/parsers/spitzingsee.js
import fetch from "node-fetch";
import cheerio from "cheerio";

const URL = "https://www.alpenbahnen-spitzingsee.de/de/pistenstatus.html";

export default async function spitzingsee() {
  try {
    const res = await fetch(URL, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X)",
        "Accept-Language": "de-DE,de;q=0.9"
      }
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const html = await res.text();
    const $ = cheerio.load(html);

    // Beispiel: Tabelle mit Liftstatus (öffnet/geschlossen)
    let open = 0;
    let total = 0;

    $("table.liftstatus tr").each((_, el) => {
      const cols = $(el).find("td");
      if (cols.length >= 2) {
        const name = $(cols[0]).text().trim();
        const status = $(cols[1]).text().toLowerCase();

        total++;

        if (
          status.includes("in betrieb") ||
          status.includes("geöffnet") ||
          status.includes("offen")
        ) {
          open++;
        }
      }
    });

    // Fallback: Suche allgemein im Text
    if (total === 0) {
      const body = $("body").text().toLowerCase();
      const openHits =
        (body.match(/in betrieb|geöffnet|offen/g) || []).length;
      const closedHits =
        (body.match(/außer betrieb|geschlossen|zu/g) || []).length;

      if (openHits + closedHits > 0) {
        open = openHits;
        total = openHits + closedHits;
      }
    }

    if (total === 0) {
      throw new Error("Kein Liftstatus gefunden");
    }

    return {
      resort: "Spitzingsee",
      liftsOpen: open,
      liftsTotal: total,
      source: "alpenbahnen-spitzingsee.de",
      status: "website",
      lastUpdated: new Date().toISOString()
    };
  } catch (err) {
    console.error("Spitzingsee Parser failed:", err.message);
    throw err;
  }
}
