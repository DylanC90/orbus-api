Orbus API — Endpoints
Base: http://localhost:3001

GET /health
text
/health
json
{ "ok": true, "now": "2026-10-21T15:11:25.434Z" }
Liveness check. 500 if RethinkDB is down.

GET /player/:name
text
/player/test
json
{
  "name": "test",
  "mobKills": 5,
  "playtimeSeconds": 1422,
  "playtimeHours": 0.4,
  "classLevels": { "archer": 20, "fisher": 1, "orbhealer": 1, "runemage": 1, "swordboard": 1 },
  "lastPlayed": 1792161301,
  "lastPlayedISO": "2026-10-16T05:15:01.000Z",
  "equipped": {
    "weapon": { "slot": "Weapon", "index": 4, "id": "229", "ver": "1", "data": { "attack": 1380, "intellect": 100, "strength": 98, "affixes": ["bleed"], "tileset": [252,256,255,253,254], "rarity": "epic" }, "tileset": [252,256,255,253,254], "affixes": ["bleed"] },
    "armor": [
      { "slot": "Helmet",     "index": 0, "id": "538", "data": { "armor": 331, "vitality": 87, "tileset": [253,255,254] }, "tileset": [253,255,254] },
      { "slot": "Shoulders",  "index": 1, "id": "541", "data": { "...": "..." } },
      { "slot": "Chestplate", "index": 5, "id": "540", "data": { "...": "..." } },
      { "slot": "Gloves",     "index": 6, "id": "539", "data": { "...": "..." } }
    ],
    "rings": [
      { "slot": "Ring 1", "index": 3, "id": "493", "data": null },
      { "slot": "Ring 2", "index": 8, "id": "493", "data": null }
    ]
  }
}
Full stats + equipped gear for one character. Case-sensitive. 404 if not found. Class levels exclude unarmed/barbarian.

GET /topkills?limit=N
text
/topkills?limit=10
json
[{ "name": "test", "mobKills": 5 }]
Top players by mob kills. Default 10, max 100. Zero-kill excluded.

GET /topplaytime?limit=N
text
/topplaytime?limit=10
json
[{ "name": "test", "playtimeHours": 0.4 }]
Top players by playtime. Default 10, max 100. Zero-playtime excluded.

GET /topclass?limit=N
text
/topclass?limit=10
json
[{ "name": "test", "avgClassLevel": 4.8, "classLevels": { "archer": 20, "fisher": 1, "orbhealer": 1, "runemage": 1, "swordboard": 1 } }]
Top players by average level across the 5 counted classes. Default 10, max 100.