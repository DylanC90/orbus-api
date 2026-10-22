const { r, RETHINK, run, collect } = require("./db");
const { classLevelsFiltered } = require("./parse");

async function getTopKills(limit = 10) {
  const cursor = await run(
    r.db(RETHINK.db).table("Player")
      .filter(p => p("records")("monsters_killed").default(0).gt(0))
      .map(p => ({
        name: p("name"),
        mobKills: p("records")("monsters_killed").default(0),
      }))
      .orderBy(r.desc("mobKills"))
      .limit(limit)
  );
  return await collect(cursor);
}

async function getTopPlaytime(limit = 10) {
  const cursor = await run(
    r.db(RETHINK.db).table("Player")
      .filter(p => p("timePlayed").default(0).gt(0))
      .map(p => ({
        name: p("name"),
        playtimeSeconds: p("timePlayed").default(0),
      }))
      .orderBy(r.desc("playtimeSeconds"))
      .limit(limit)
  );
  const rows = await collect(cursor);
  return rows.map(x => ({
    name: x.name,
    playtimeHours: +(x.playtimeSeconds / 3600).toFixed(2),
  }));
}

async function getTopClass(limit = 10) {
  const cursor = await run(
    r.db(RETHINK.db).table("Player")
      .map(p => ({
        name: p("name"),
        classLevels: p("skill_level").default({}),
      }))
      .limit(500)
  );
  const rows = await collect(cursor);

  const scored = rows.map(x => {
    const filtered = classLevelsFiltered(x.classLevels);
    const vals = Object.values(filtered);
    const avg = vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
    return { name: x.name, avgClassLevel: +avg.toFixed(2), classLevels: filtered };
  });

  scored.sort((a, b) => b.avgClassLevel - a.avgClassLevel);
  return scored.slice(0, limit);
}

module.exports = { getTopKills, getTopPlaytime, getTopClass };