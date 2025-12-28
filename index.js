export default async function spitzingsee() {
  const url = "https://www.alpenbahnen-spitzingsee.de/api/lifts";

  const res = await fetch(url, {
    headers: {
      "user-agent": "Mozilla/5.0",
      "accept": "application/json"
    }
  });

  const text = await res.text();

  if (!text) {
    throw new Error("Spitzingsee API returned empty response");
  }

  const lifts = JSON.parse(text);

  if (!Array.isArray(lifts) || lifts.length === 0) {
    throw new Error("Spitzingsee parsing returned zero lifts");
  }

  const liftsTotal = lifts.length;
  const liftsOpen = lifts.filter(l => l.status === "OPEN").length;

  return {
    resort: "Spitzingsee",
    slug: "spitzingsee",
    liftsOpen,
    liftsTotal,
    source: "alpenbahnen-spitzingsee.de/api/lifts",
    status: "parsed",
    lastUpdated: new Date().toISOString()
  };
}
