const { r, RETHINK, run } = require("./db");
const questData = require('./possible_quests.json');

async function getPlayerQuestStats(name) {
  const doc = await run(
    r.db(RETHINK.db).table("Player")
      .filter(p => p("name").eq(name).and(p("deleted").default(false).not()))
      .nth(0)
      .do(p => ({
        questflags: p("questflags").default([])
      }))
  );

  const playerFlags = doc.questflags || [];
  const flagSet = new Set(playerFlags);

  let completedCount = 0;
  let totalQuestXP = 0;
  let remainingQuestXP = 0;
  const remainingQuestNames = [];

  for (const group of questData) {
    const done = group.find(q => flagSet.has(`qf_${q.id}_cp`));

    if (done) {
      completedCount++;
      totalQuestXP += done.xp;
    } else {
      remainingQuestXP += Math.max(...group.map(q => q.xp));
      remainingQuestNames.push(group[0].name);
    }
  }

  return {
    name,
    totalPossible: questData.length,
    completedCount,
    totalQuestXP,
    remainingQuestXP,
    remainingQuestNames
  };
}

module.exports = { getPlayerQuestStats };