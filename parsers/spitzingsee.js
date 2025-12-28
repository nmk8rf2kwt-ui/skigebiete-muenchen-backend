export default async function spitzingsee() {
  const url = "https://www.alpenbahnen-spitzingsee.de/api/lifts";

  const res = await fetch(url, {
    headers: {
      "user-agent": "skigebiete-muenchen-bot"
    }
  });

  if (!res.ok) {
    throw new Error("Spitzingsee API not reachable");
  }

  const lifts = await res.json();

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
