const r = require("rethinkdb");

const RETHINK = {
  host: process.env.RETHINK_HOST || "127.0.0.1",
  port: Number(process.env.RETHINK_PORT) || 28015,
  db: process.env.RETHINK_DB || "orbus",
};

let conn = null;
let connecting = null;

async function getConn() {
  if (conn) return conn;
  if (connecting) return connecting;
  connecting = (async () => {
    const c = await r.connect({
      host: RETHINK.host,
      port: RETHINK.port,
      db: RETHINK.db,
    });
    c.on("close", () => { conn = null; });
    c.on("error", () => { conn = null; });
    conn = c;
    connecting = null;
    return c;
  })();
  return connecting;
}

async function run(query) {
  const c = await getConn();
  return query.run(c);
}

async function collect(result) {
  if (Array.isArray(result)) return result;
  if (result && typeof result.toArray === "function") {
    return await result.toArray();
  }
  const out = [];
  for await (const row of result) out.push(row);
  return out;
}

module.exports = { r, RETHINK, getConn, run, collect };