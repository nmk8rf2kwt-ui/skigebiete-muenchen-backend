export default async function garmisch() {
  const res = await fetch("https://www.garmisch-classic.de/skigebiet/lifte-pisten/", {
    headers: { "User-Agent": "Mozilla/5.0" }
  });

  const html = await res.text();

  const total = (html.match(/lift-item/g) || []).length;
  const open = (html.match(/lift-item open/g) || []).length;

  if (!total) {
    throw new Error("Garmisch parsing returned zero lifts");
  }

  return {
    resort: "Garmisch-Classic",
    slug: "garmisch",
    liftsOpen: open,
    liftsTotal: total,
    source: "garmisch-classic.de",
    status: "parsed",
    lastUpdated: new Date().toISOString()
  };
}
