import cheerio from "cheerio";

/**
 * Parser für Spitzingsee
 * Quelle: alpenbahnen-spitzingsee.de
 */
export default async function spitzingsee() {
  const url =
    "https://www.alpenbahnen-spitzingsee.de/de/pistenstatus.html";

  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X) AppleWebKit/537.36",
      "Accept-Language": "de-DE,de;q=0.9",
    },
  });

  if (!res.ok) {
    throw new Error(`Spitzingsee fetch failed: ${res.status}`);
  }

  const html = await res.text();
  const $ = cheerio.load(html);

  let liftsTotal = 0;
  let liftsOpen = 0;

  /**
   * Die Seite listet Lifte als Elemente mit Status-Icon/Text
   * Wir zählen:
   * - alle Lift-Einträge
   * - davon jene mit "geöffnet"
   */
  $(".lift-list .lift-item").each((_, el) => {
    liftsTotal++;

    const text = $(el).text().toLowerCase();

    if (text.includes("geöffnet")) {
      liftsOpen++;
    }
  });

  // Fallback-Schutz
  if (liftsTotal === 0) {
    throw new Error("Spitzingsee parsing failed: no lifts found");
  }

  return {
    resort: "Spitzingsee",
    slug: "spitzingsee",
    liftsOpen,
    liftsTotal,
    source: "alpenbahnen-spitzingsee.de",
    status: "parsed",
  };
}
