const { r, RETHINK, run } = require("./db");

async function getPlayerQuestFlags(name) {
  const doc = await run(
    r.db(RETHINK.db).table("Player")
      .filter(p => p("name").eq(name).and(p("deleted").default(false).not()))
      .nth(0)
      .do(p => ({
        questflags: p("questflags").default([])
      }))
  );

  const playerFlags = doc.questflags || [];
  const cpFlags = playerFlags.filter(flag => flag.startsWith('qf_') && flag.endsWith('_cp'));

  return {
    name,
    completedFlags: cpFlags
  };
}

module.exports = { getPlayerQuestFlags };