import * as cheerio from "cheerio";

export async function garmisch(html) {
  const $ = cheerio.load(html);

  let liftsTotal = 0;
  let liftsOpen = 0;

  $("table tr").each((_, row) => {
    const text = $(row).text().toLowerCase();
    if (text.includes("bahn") || text.includes("lift")) {
      liftsTotal++;
      if (text.includes("geöffnet")) {
        liftsOpen++;
      }
    }
  });

  if (liftsTotal === 0) {
    throw new Error("Garmisch parsing returned zero lifts");
  }

  return {
    resort: "Garmisch-Classic",
    liftsOpen,
    liftsTotal,
    source: "zugspitze.de",
    status: "ok",
    lastUpdated: new Date().toISOString()
  };
}
