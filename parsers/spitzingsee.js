import * as cheerio from "cheerio";

export async function spitzingsee(html) {
  const $ = cheerio.load(html);

  const rows = $("table tr");
  let liftsTotal = 0;
  let liftsOpen = 0;

  rows.each((_, row) => {
    const statusText = $(row).text().toLowerCase();

    if (statusText.includes("lift")) {
      liftsTotal++;
      if (statusText.includes("geöffnet")) {
        liftsOpen++;
      }
    }
  });

  if (liftsTotal === 0) {
    throw new Error("Spitzingsee parsing returned zero lifts");
  }

  return {
    resort: "Spitzingsee",
    liftsOpen,
    liftsTotal,
    source: "alpenbahnen-spitzingsee.de",
    status: "ok",
    lastUpdated: new Date().toISOString()
  };
}
