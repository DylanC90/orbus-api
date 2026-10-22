# Orbus API

## Endpoints

### `GET /health`

Liveness check. Returns **500** if RethinkDB is down.

```
/health
```

```json
{ "ok": true, "now": "2026-10-21T15:11:25.434Z" }
```

---

### `GET /player/:name`

Full stats and equipped gear for one character. **Case-sensitive.** Returns **404** if not found.

```
/player/test
```

```json
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
```
-Ring Data wont be null once i see proper formatting, but it should work regardless as I'm just grabbing properties from the items
---

### `GET /topkills?limit=N`

Top players by mob kills. Default **10**, max **100**. Zero-kill players are excluded.

```
/topkills?limit=10
```

```json
[{ "name": "test", "mobKills": 5 }]
```

---

### `GET /topplaytime?limit=N`

Top players by playtime. Default **10**, max **100**. Zero-playtime players are excluded.

```
/topplaytime?limit=10
```

```json
[{ "name": "test", "playtimeHours": 0.4 }]
```

---

### `GET /topclass?limit=N`

Top players by average level across the 5 counted classes. Default **10**, max **100**.

```
/topclass?limit=10
```

```json
[{ "name": "test", "avgClassLevel": 4.8, "classLevels": { "archer": 20, "fisher": 1, "orbhealer": 1, "runemage": 1, "swordboard": 1 } }]
```


# INSTALLATION GUIDE
 
## 1. Upload the folder
 
Find this Folder, aka where the server files are Located:
ENSURE IT IS NAME "orbus-api"
 
```
/classic-server/
```
 
It must end up as `~/classic-server/orbus-api/`, next to `docker-compose.yml`.
 
## 2. Add the service
 
Edit `~/classic-server/docker-compose.yml` and add this under `services:` (**2-space indent**), after the `api:` block:
If any of the RETHNK data has been altered change it here to correspond with server setup.

```yaml
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
```
 
## 3. Open the port
 
Make sure port 3001 is open, as its the default api port
 
## 4. Start it

```bash
docker compose up -d --build orbus-api
```

Then check the log for errors or success message
```
docker compose logs -f orbus-api
```

Expected output:
 
```
[api] listening on http://localhost:3001
```
 
## 5. Test
 
```bash
curl http://localhost:3001/health
```
 
---
