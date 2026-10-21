// Runs every morning. Emails info@ when an MOT, service, tax, insurance, breakdown cover,
// safety check or driver licence check on the Vehicles tab (/board/vans/) comes due.
// What was already sent is kept under "fleet-sent" so nobody gets the same reminder twice.
import { getStore } from "@netlify/blobs";
import { pickReminders, buildEmail, sendEmail, ukToday } from "../../board/vans/fleet-core.mjs";

export default async () => {
  const store = getStore({ name: "team-board", consistency: "strong" });
  const fleet = await store.get("fleet-v1", { type: "json" });
  if (!fleet) return new Response("no vehicles yet");

  const sent = (await store.get("fleet-sent", { type: "json" })) || {};
  const today = ukToday();
  const r = pickReminders(fleet, sent, today);

  if (r.due.length || r.nudges.length) {
    try {
      await sendEmail(buildEmail({ ...r, today }), process.env.RESEND_API_KEY);
    } catch (e) {
      // Nothing is marked as sent, so tomorrow's run tries again
      console.error("fleet reminders:", e);
      return new Response("email failed", { status: 500 });
    }
  }
  await store.setJSON("fleet-sent", r.sent);
  return new Response(`sent ${r.due.length} reminders, ${r.nudges.length} mileage nudges`);
};

// 06:00 UTC is 7am in summer and 6am in winter, UK time
export const config = { schedule: "0 6 * * *" };
