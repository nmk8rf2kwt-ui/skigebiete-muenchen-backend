export default async function sudelfeld() {
  const res = await fetch("https://www.sudelfeld.de/skigebiet/lifte-pisten", {
    headers: { "User-Agent": "Mozilla/5.0" }
  });

  const html = await res.text();

  // zählt Einträge mit Status offen/geschlossen
  const total = (html.match(/lift-status/g) || []).length;
  const open = (html.match(/lift-status open/g) || []).length;

  if (!total) {
    throw new Error("Sudelfeld parsing returned zero lifts");
  }

  return {
    resort: "Sudelfeld",
    slug: "sudelfeld",
    liftsOpen: open,
    liftsTotal: total,
    source: "sudelfeld.de",
    status: "parsed",
    lastUpdated: new Date().toISOString()
  };
}
