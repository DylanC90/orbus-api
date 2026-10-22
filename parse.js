function parseItem(raw, index) {
  if (!raw || typeof raw !== "string") return null;
  const parts = raw.split("@");
  const id = parts[0];
  const ver = parts.length >= 2 ? parts[1] : null;
  let data = null;
  if (parts.length >= 3) {
    try { data = JSON.parse(parts.slice(2).join("@")); } catch { data = null; }
  }

  const item = { index, id, ver, data };
  if (data) {
    if (Array.isArray(data.tileset)) {
      item.tileset = data.tileset;
      delete data.tileset;
    }
    if (Array.isArray(data.affixes)) {
      item.affixes = data.affixes;
      delete data.affixes;
    }
  }
  return item;
}

const EQUIP_SLOTS = {
  0: { slot: "armor",  name: "Helmet" },
  1: { slot: "armor",  name: "Shoulders" },
  3: { slot: "ring",   name: "Ring 1" },
  4: { slot: "weapon", name: "Weapon" },
  5: { slot: "armor",  name: "Chestplate" },
  6: { slot: "armor",  name: "Gloves" },
  8: { slot: "ring",   name: "Ring 2" },
};

function parseEquipped(inv) {
  const equipped = { weapon: null, armor: [], rings: [] };
  if (!Array.isArray(inv)) return equipped;
  for (const [idxStr, def] of Object.entries(EQUIP_SLOTS)) {
    const i = Number(idxStr);
    const raw = inv[i];
    if (!raw || typeof raw !== "string") continue;
    const p = parseItem(raw, i);
    if (!p) continue;
    p.slot = def.name;
    if (def.slot === "weapon") equipped.weapon = p;
    else if (def.slot === "ring") equipped.rings.push(p);
    else equipped.armor.push(p);
  }
  return equipped;
}

const CLASS_SKIP = new Set(["unarmed", "barbarian"]);

function classLevelsFiltered(skillLevel) {
  const out = {};
  if (!skillLevel || typeof skillLevel !== "object") return out;
  for (const [cls, lvl] of Object.entries(skillLevel)) {
    if (CLASS_SKIP.has(cls.toLowerCase())) continue;
    out[cls] = lvl;
  }
  return out;
}

function unixSecondsToISO(sec) {
  return sec && typeof sec === "number" ? new Date(sec * 1000).toISOString() : null;
}

module.exports = {
  parseItem,
  parseEquipped,
  classLevelsFiltered,
  unixSecondsToISO,
};