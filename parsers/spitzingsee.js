import cheerio from "cheerio";

export async function spitzingsee() {
  const url = "https://www.alpenbahnen-spitzingsee.de/de/liftstatus.html";
  const res = await fetch(url);
  const html = await res.text();

  const $ = cheerio.load(html);

  let total = 0;
  let open = 0;

  $("table tbody tr").each((_, row) => {
    const status = $(row).find("td").first().text().toLowerCase();
    if (!status) return;

    total++;
    if (status.includes("geöffnet")) open++;
  });

  return {
    resort: "Spitzingsee",
    liftsOpen: open,
    liftsTotal: total,
    source: "alpenbahnen-spitzingsee.de",
    status: "website"
  };
}
