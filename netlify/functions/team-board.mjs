// Shared storage for the Staff Positioning board at /board/
// GET  /api/team-board  -> current board JSON (or null if never saved)
// PUT  /api/team-board  -> replace board JSON
// Every request must carry the team PIN in the x-team-pin header.
// Set TEAM_PIN in Netlify > Site configuration > Environment variables.
import { getStore } from "@netlify/blobs";

const KEY = "board-v1";
const FALLBACK_PIN = "2011";

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });
}

export default async (req) => {
  const expected = (process.env.TEAM_PIN || FALLBACK_PIN).trim();
  const given = (req.headers.get("x-team-pin") || "").trim();
  if (!given || given !== expected) return json({ error: "bad-pin" }, 401);

  const store = getStore({ name: "team-board", consistency: "strong" });

  if (req.method === "GET") {
    const data = await store.get(KEY, { type: "json" });
    return json(data || null);
  }

  if (req.method === "PUT") {
    let body;
    try {
      body = await req.json();
    } catch {
      return json({ error: "bad-json" }, 400);
    }
    if (!body || typeof body !== "object" || !Array.isArray(body.staff)) {
      return json({ error: "bad-board" }, 400);
    }
    if (JSON.stringify(body).length > 400_000) return json({ error: "too-large" }, 413);
    body.updatedAt = new Date().toISOString();
    await store.setJSON(KEY, body);
    return json({ ok: true, updatedAt: body.updatedAt });
  }

  return json({ error: "method" }, 405);
};

export const config = { path: "/api/team-board" };
