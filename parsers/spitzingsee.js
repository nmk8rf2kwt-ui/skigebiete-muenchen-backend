import { load } from "cheerio";

const URL = "https://www.alpenbahnen-spitzingsee.de/de/liftstatus.html";

export async function spitzingsee() {
  const res = await fetch(URL);
  if (!res.ok) throw new Error("Failed to fetch Spitzingsee");

  const html = await res.text();
  const $ = load(html);

  let liftsTotal = 0;
  let liftsOpen = 0;

  // Jede Tabellenzeile = ein Lift
  $("table tbody tr").each((_, row) => {
    liftsTotal++;

    const statusText = $(row).find("td").first().text().toLowerCase();
    if (statusText.includes("geöffnet")) {
      liftsOpen++;
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
    status: "website",
    lastUpdated: new Date().toISOString()
  };
}
