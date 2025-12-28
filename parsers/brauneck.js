import { load } from "cheerio";

const URL = "https://www.brauneck-bergbahn.de/de/lift-pistenstatus.html";

export async function brauneck() {
  const res = await fetch(URL);
  if (!res.ok) throw new Error("Failed to fetch Brauneck");

  const html = await res.text();
  const $ = load(html);

  let liftsTotal = 0;
  let liftsOpen = 0;

  $(".liftstatus-table tbody tr").each((_, row) => {
    liftsTotal++;

    const status = $(row).find(".status").text().toLowerCase();
    if (status.includes("offen") || status.includes("geöffnet")) {
      liftsOpen++;
    }
  });

  if (liftsTotal === 0) {
    throw new Error("Brauneck parsing returned zero lifts");
  }

  return {
    resort: "Brauneck",
    liftsOpen,
    liftsTotal,
    source: "brauneck-bergbahn.de",
    status: "website",
    lastUpdated: new Date().toISOString()
  };
}
