This readme is AI generated based on the contents of the API

Orbus API — Endpoints
Base: http://localhost:3001

GET /health
Liveness + DB check.

json
{ "ok": true, "now": "2026-10-21T15:11:25.434Z" }
GET /player/:name
Full stats + equipped gear for one character. :name is case-sensitive.

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
      { "slot": "Helmet",     "index": 0, "id": "538", "data": { "armor": 331, "vitality": 87, "defense": 90, "tileset": [253,255,254] }, "tileset": [253,255,254] },
      { "slot": "Shoulders",  "index": 1, "id": "541", "data": { ... } },
      { "slot": "Chestplate", "index": 5, "id": "540", "data": { ... }, "tileset": [253,254,256,252] },
      { "slot": "Gloves",     "index": 6, "id": "539", "data": { ... }, "tileset": [256,255,252] }
    ],
    "rings": [
      { "slot": "Ring 1", "index": 3, "id": "493", "data": null },
      { "slot": "Ring 2", "index": 8, "id": "493", "data": null }
    ]
  }
}
classLevels excludes unarmed / barbarian

lastPlayed = Unix seconds

equipped covers inventory indices 0, 1, 3, 4, 5, 6, 8 only — bag, materials, tokens, capes, currency never returned

Each item: slot, index, id, ver, data (parsed stats or null), plus tileset / affixes lifted from data when present

404 → { "error": "not found" }

GET /topkills?limit=N
Top players by mob kills. limit default 10, max 100. Zero-kill excluded.

json
[{ "name": "test", "mobKills": 5 }]
GET /topplaytime?limit=N
Top players by playtime. Same limit rules. Zero-playtime excluded.

json
[{ "name": "test", "playtimeHours": 0.4 }]
GET /topclass?limit=N
Top players by average class level across the 5 counted classes (archer, fisher, orbhealer, runemage, swordboard). Same limit rules.

json
[{ "name": "test", "avgClassLevel": 4.8, "classLevels": { "archer": 20, "fisher": 1, "orbhealer": 1, "runemage": 1, "swordboard": 1 } }]
Install (for someone else's server)
Drop the orbus-api folder next to their docker-compose.yml:

text
classic-server/
├── docker-compose.yml
├── content/
├── mods/
└── orbus-api/     ← here
Add this service to their docker-compose.yml — under services:, same 2-space indent as redis: / rethinkdb: / game: / api:, after the api: block:

yaml
  orbus-api:
    build:
      context: ./orbus-api
    restart: unless-stopped
    environment:
      RETHINK_HOST: rethinkdb
      RETHINK_PORT: 28015
      RETHINK_DB: orbus
      PORT: 3001
    depends_on:
      setup:
        condition: service_completed_successfully
    ports:
      - "3001:3001"
Build + start:

bash
cd classic-server
docker compose up -d --build orbus-api
docker compose logs -f orbus-api
Expected: [api] listening on http://localhost:3001

Test:

bash
curl http://localhost:3001/health
curl http://localhost:3001/player/YourCharacterName
curl "http://localhost:3001/topkills?limit=10"
curl "http://localhost:3001/topplaytime?limit=10"
curl "http://localhost:3001/topclass?limit=10"
Requirements: Docker + Docker Compose, and the classic-server stack running (rethinkdb and setup must exist — they do in the stock compose file). No Node, no npm, no .env, no node_modules.