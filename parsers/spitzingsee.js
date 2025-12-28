// backend/parsers/spitzingsee.js
import cheerio from "cheerio";

/**
 * Live-Parser für Spitzingsee
 * Quelle: alpenbahnen-spitzingsee.de
 */
export default async function spitzingsee() {
  const url =
    "https://www.alpenbahnen-spitzingsee.de/de/liftstatus.html";

  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X)",
      "Accept-Language": "de-DE,de;q=0.9",
    },
  });

  if (!res.ok) {
    throw new Error(`Spitzingsee fetch failed: ${res.status}`);
  }

  const html = await res.text();
  const $ = cheerio.load(html);

  let liftsOpen = 0;
  let liftsTotal = 0;

  /**
   * Liftstatus-Seite enthält Status-Texte
   * Wir zählen jede Lift-Zeile
   */
  $("tr").each((_, el) => {
    const text = $(el).text().toLowerCase();

    if (
      text.includes("lift") ||
      text.includes("bahn")
    ) {
      if (
        text.includes("geöffnet") ||
        text.includes("in betrieb")
      ) {
        liftsOpen++;
        liftsTotal++;
      } else if (
        text.includes("geschlossen") ||
        text.includes("außer betrieb")
      ) {
        liftsTotal++;
      }
    }
  });

  if (liftsTotal === 0) {
    throw new Error("Spitzingsee parsing failed");
  }

  return {
    resort: "Spitzingsee",
    slug: "spitzingsee",
    liftsOpen,
    liftsTotal,
    source: "alpenbahnen-spitzingsee.de",
    status: "parsed",
    lastUpdated: new Date().toISOString(),
  };
}
