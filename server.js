const express = require("express");
const { getConn } = require("./db");
const { getStats } = require("./player");
const { getTopKills, getTopPlaytime } = require("./leaderboard");

const app = express();
app.use(express.json());

function parseLimit(q, def = 10, max = 100) {
  const n = Number(q);
  if (!Number.isFinite(n) || n <= 0) return def;
  return Math.min(Math.floor(n), max);
}

function handle(fn) {
  return async (req, res) => {
    try {
      await fn(req, res);
    } catch (e) {
      if (e && e.name === "ReqlNonExistenceError") {
        return res.status(404).json({ error: "not found" });
      }
      res.status(500).json({ error: e.message || "internal error" });
    }
  };
}

app.get("/health", handle(async (req, res) => {
  const { r, run } = require("./db");
  const now = await run(r.now());
  res.json({ ok: true, now });
}));

app.get("/player/:name", handle(async (req, res) => {
  const data = await getStats(req.params.name);
  res.json(data);
}));

app.get("/topkills", handle(async (req, res) => {
  const limit = parseLimit(req.query.limit);
  const data = await getTopKills(limit);
  res.json(data);
}));

app.get("/topplaytime", handle(async (req, res) => {
  const limit = parseLimit(req.query.limit);
  const data = await getTopPlaytime(limit);
  res.json(data);
}));

app.get("/topclass", handle(async (req, res) => {
  const limit = parseLimit(req.query.limit);
  const { getTopClass } = require("./leaderboard");
  const data = await getTopClass(limit);
  res.json(data);
}));

const PORT = Number(process.env.PORT) || 3001;
app.listen(PORT, () => {
  getConn().catch(() => {});
});