const { r, RETHINK, run } = require("./db");
const { parseEquipped, classLevelsFiltered, unixSecondsToISO } = require("./parse");

async function getStats(name) {
  const doc = await run(
    r.db(RETHINK.db).table("Player")
      .filter({ name })
      .nth(0)
      .do(p => ({
        name: p("name"),
        mobKills: p("records")("monsters_killed").default(0),
        playtimeSeconds: p("timePlayed").default(0),
        classLevels: p("skill_level").default({}),
        lastPlayed: p("lastSeen").default(0),
        inventory: p("inventory").default([]),
      }))
  );

  return {
    name: doc.name,
    mobKills: doc.mobKills,
    playtimeSeconds: doc.playtimeSeconds,
    playtimeHours: +(doc.playtimeSeconds / 3600).toFixed(2),
    classLevels: classLevelsFiltered(doc.classLevels),
    lastPlayed: doc.lastPlayed,
    lastPlayedISO: unixSecondsToISO(doc.lastPlayed),
    equipped: parseEquipped(doc.inventory),
  };
}

module.exports = { getStats };