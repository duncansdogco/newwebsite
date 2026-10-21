// Shared storage for the Vehicles tab at /board/vans/
// GET  /api/fleet                  -> current vehicles JSON (or null if never saved)
// PUT  /api/fleet                  -> replace vehicles JSON
// POST /api/fleet {action:"test"}  -> email info@ a test reminder with what is due in 60 days
// Every request must carry the same team PIN as the Staff Positioning board.
import { getStore } from "@netlify/blobs";
import { pickReminders, buildEmail, sendEmail, ukToday } from "../../board/vans/fleet-core.mjs";

const KEY = "fleet-v1";
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
    if (!body || typeof body !== "object" || !Array.isArray(body.vehicles)) {
      return json({ error: "bad-fleet" }, 400);
    }
    if (JSON.stringify(body).length > 400_000) return json({ error: "too-large" }, 413);
    body.updatedAt = new Date().toISOString();
    await store.setJSON(KEY, body);
    return json({ ok: true, updatedAt: body.updatedAt });
  }

  if (req.method === "POST") {
    const body = await req.json().catch(() => ({}));
    if (body.action !== "test") return json({ error: "action" }, 400);
    const fleet = (await store.get(KEY, { type: "json" })) || { vehicles: [], drivers: [] };
    const today = ukToday();
    // Picks against an empty history so everything in the next 60 days shows; nothing is marked as sent
    const r = pickReminders(fleet, {}, today);
    try {
      await sendEmail(buildEmail({ due: r.due, upcoming: r.upcoming, nudges: [], today, test: true }), process.env.RESEND_API_KEY);
    } catch (e) {
      console.error("fleet test email:", e);
      return json({ error: "email" }, 502);
    }
    return json({ ok: true });
  }

  return json({ error: "method" }, 405);
};

export const config = { path: "/api/fleet" };
