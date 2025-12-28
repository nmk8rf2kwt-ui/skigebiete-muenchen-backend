import * as cheerio from "cheerio";

export default async function spitzingsee() {
  const url =
    "https://www.alpenbahnen-spitzingsee.de/de/liftstatus.html";

  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0",
      "Accept-Language": "de-DE,de;q=0.9",
    },
  });

  if (!res.ok) {
    throw new Error("Spitzingsee fetch failed");
  }

  const html = await res.text();
  const $ = cheerio.load(html);

  let liftsOpen = 0;
  let liftsTotal = 0;

  // Jede Tabellenzeile mit Status zählen
  $("tr").each((_, el) => {
    const row = $(el).text().toLowerCase();

    if (
      row.includes("lift") ||
      row.includes("sesselbahn")
    ) {
      liftsTotal++;

      if (row.includes("geöffnet")) {
        liftsOpen++;
      }
    }
  });

  if (liftsTotal === 0) {
    throw new Error("Spitzingsee parsing returned zero lifts");
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
