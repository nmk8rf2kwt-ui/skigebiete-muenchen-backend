export default async function spitzingsee() {
  return {
    resort: "Spitzingsee",
    slug: "spitzingsee",
    liftsOpen: null,
    liftsTotal: 11,
    source: "alpenbahnen-spitzingsee.de (client-rendered)",
    status: "unavailable",
    note: "Liftstatus wird clientseitig gerendert und ist serverseitig nicht abrufbar",
    lastUpdated: new Date().toISOString()
  };
}
