// parsers/brauneck.js
import fetch from "node-fetch";
import * as cheerio from "cheerio";

export default async function brauneck() {
  const url = "https://www.brauneck-bergbahn.de/de/lift-pistenstatus.html";
  const res = await fetch(url);
  const html = await res.text();

  const $ = cheerio.load(html);

  let open = 0;
  let total = 0;

  $(".liftstatus table tbody tr").each((_, row) => {
    total++;
    const status = $(row).find("td").eq(1).text().toLowerCase();
    if (status.includes("offen")) open++;
  });

  if (total === 0) {
    throw new Error("Brauneck parsing returned zero lifts");
  }

  return {
    resort: "Brauneck / Lenggries",
    slug: "brauneck",
    liftsOpen: open,
    liftsTotal: total,
    source: "brauneck-bergbahn.de",
    status: "parsed",
    lastUpdated: new Date().toISOString()
  };
}
