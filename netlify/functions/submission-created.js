exports.handler = async function (event) {
  try {
    const payload = JSON.parse(event.body).payload;
    const d = payload.data || {};

    const name       = d.name        || "—";
    const email      = d.email       || "—";
    const phone      = d.phone       || "—";
    const dogName    = d.dog_name    || "—";
    const breed      = d.breed       || "—";
    const age        = d.dog_age     || "—";
    const neutered   = d.neutered    || "—";
    const sex        = d.sex         || "—";
    const address    = d.address     || "—";
    const service    = d.service     || "—";
    const message    = d.message     || "";

    const isDaycare  = service.toLowerCase().includes("daycare") || service.toLowerCase().includes("puppy");
    const badgeColor = isDaycare ? "#065f46" : "#1e40af";
    const badgeBg    = isDaycare ? "#d1fae5"  : "#dbeafe";
    const badgeIcon  = isDaycare ? "🟢" : "🔵";

    // Flag anything health/behaviour-related in the notes
    const alertWords = ["allerg", "apoquel", "medication", "dysplasia", "anxious", "rescue", "resource guard", "aggress", "intact", "not neutered"];
    const hasAlert   = alertWords.some(w => message.toLowerCase().includes(w));

    const submittedAt = new Date(payload.created_at || Date.now()).toLocaleString("en-GB", {
      timeZone: "Europe/London",
      weekday: "short", day: "numeric", month: "short",
      hour: "2-digit", minute: "2-digit"
    });

    // Where the enquiry came from, read from the form's hidden fields
    const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
    const src    = (d.utm_source || "").toLowerCase();
    const medium = (d.utm_medium || "").toLowerCase();
    let refHost = "";
    try { refHost = d.referrer ? new URL(d.referrer).hostname.replace(/^www\./, "") : ""; } catch (e) { refHost = ""; }

    let cameFrom;
    if (d.gclid || d.gbraid || d.wbraid || (src === "google" && /cpc|paid/.test(medium))) {
      cameFrom = "Google ad";
    } else if (/^(meta|facebook|instagram|fb|ig)$/.test(src) && /paid|cpc|ad/.test(medium)) {
      cameFrom = `Meta ad${d.utm_content ? ` (${d.utm_content} ad)` : ""}`;
    } else if (d.fbclid) {
      cameFrom = "Instagram or Facebook link (not an ad)";
    } else if (src) {
      cameFrom = `Link tagged ${src}${medium ? ` / ${medium}` : ""}`;
    } else if (/(^|\.)google\./.test(refHost) || /(^|\.)bing\.com$/.test(refHost)) {
      cameFrom = "Google or Bing search (not an ad)";
    } else if (/instagram|facebook/.test(refHost)) {
      cameFrom = "Instagram or Facebook (not an ad)";
    } else if (refHost && !refHost.endsWith("duncansdogco.com")) {
      cameFrom = `Link on ${refHost}`;
    } else if (!refHost) {
      cameFrom = "Typed our address or used a bookmark";
    } else {
      cameFrom = "Not known (they may have said no to cookies)";
    }
    const firstPage   = d.landing_page || "Not known";
    const theirAnswer = d.heard_about_us || "Not answered";
    const sourceShort = cameFrom.startsWith("Google ad") ? "Google ad"
      : cameFrom.startsWith("Meta ad") ? "Meta ad" : "";

    const subject = `New enquiry: ${name} — ${dogName}${sourceShort ? ` (${sourceShort})` : ""}`;

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${subject}</title>
</head>
<body style="margin:0;padding:0;background:#f0efeb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#f0efeb;padding:32px 16px 48px;">
<tr><td align="center">

  <!-- Card -->
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width:580px;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">

    <!-- Header -->
    <tr>
      <td style="background:#1c3a2b;padding:22px 28px;">
        <p style="margin:0;font-size:11px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;color:#86b89a;">Duncan's Dog Co.</p>
        <p style="margin:6px 0 0;font-size:22px;font-weight:700;color:#ffffff;line-height:1.2;">New enquiry</p>
      </td>
    </tr>

    <!-- Dog + Owner headline -->
    <tr>
      <td style="padding:24px 28px 0;">
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
          <tr>
            <td>
              <p style="margin:0;font-size:22px;font-weight:700;color:#111;">${dogName}</p>
              <p style="margin:4px 0 0;font-size:14px;color:#666;">Enquiry from ${name}</p>
            </td>
            <td align="right" style="vertical-align:top;">
              <span style="display:inline-block;background:${badgeBg};color:${badgeColor};font-size:12px;font-weight:700;padding:5px 12px;border-radius:20px;white-space:nowrap;">${badgeIcon} ${service || "Not specified"}</span>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    ${hasAlert ? `
    <!-- Alert banner -->
    <tr>
      <td style="padding:16px 28px 0;">
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
          <tr>
            <td style="background:#fef2f2;border:1px solid #fecaca;border-radius:8px;padding:10px 14px;">
              <p style="margin:0;font-size:12px;font-weight:700;color:#991b1b;">⚠️ Please read the notes section — may contain health or behaviour information</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>` : ""}

    <!-- Divider -->
    <tr><td style="padding:20px 28px 0;"><hr style="border:none;border-top:1px solid #f3f4f6;margin:0;"></td></tr>

    <!-- Contact details -->
    <tr>
      <td style="padding:16px 28px 0;">
        <p style="margin:0 0 12px;font-size:10px;font-weight:700;letter-spacing:0.8px;text-transform:uppercase;color:#9ca3af;">Contact</p>
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
          <tr>
            <td width="50%" style="vertical-align:top;padding-bottom:14px;">
              <p style="margin:0;font-size:10.5px;font-weight:600;text-transform:uppercase;letter-spacing:0.4px;color:#9ca3af;">Name</p>
              <p style="margin:3px 0 0;font-size:14px;color:#111;">${name}</p>
            </td>
            <td width="50%" style="vertical-align:top;padding-bottom:14px;">
              <p style="margin:0;font-size:10.5px;font-weight:600;text-transform:uppercase;letter-spacing:0.4px;color:#9ca3af;">Phone</p>
              <p style="margin:3px 0 0;font-size:14px;color:#111;"><a href="tel:${phone.replace(/\s/g,"")}" style="color:#111;text-decoration:none;">${phone}</a></p>
            </td>
          </tr>
          <tr>
            <td width="50%" style="vertical-align:top;padding-bottom:14px;">
              <p style="margin:0;font-size:10.5px;font-weight:600;text-transform:uppercase;letter-spacing:0.4px;color:#9ca3af;">Email</p>
              <p style="margin:3px 0 0;font-size:14px;"><a href="mailto:${email}" style="color:#2563eb;text-decoration:none;">${email}</a></p>
            </td>
            <td width="50%" style="vertical-align:top;padding-bottom:14px;">
              <p style="margin:0;font-size:10.5px;font-weight:600;text-transform:uppercase;letter-spacing:0.4px;color:#9ca3af;">Address</p>
              <p style="margin:3px 0 0;font-size:14px;color:#111;">${address}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- Divider -->
    <tr><td style="padding:4px 28px 0;"><hr style="border:none;border-top:1px solid #f3f4f6;margin:0;"></td></tr>

    <!-- Dog details -->
    <tr>
      <td style="padding:16px 28px 0;">
        <p style="margin:0 0 12px;font-size:10px;font-weight:700;letter-spacing:0.8px;text-transform:uppercase;color:#9ca3af;">About ${dogName}</p>
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
          <tr>
            <td width="50%" style="vertical-align:top;padding-bottom:14px;">
              <p style="margin:0;font-size:10.5px;font-weight:600;text-transform:uppercase;letter-spacing:0.4px;color:#9ca3af;">Breed</p>
              <p style="margin:3px 0 0;font-size:14px;color:#111;">${breed}</p>
            </td>
            <td width="50%" style="vertical-align:top;padding-bottom:14px;">
              <p style="margin:0;font-size:10.5px;font-weight:600;text-transform:uppercase;letter-spacing:0.4px;color:#9ca3af;">Age</p>
              <p style="margin:3px 0 0;font-size:14px;color:#111;">${age}</p>
            </td>
          </tr>
          <tr>
            <td width="50%" style="vertical-align:top;padding-bottom:14px;">
              <p style="margin:0;font-size:10.5px;font-weight:600;text-transform:uppercase;letter-spacing:0.4px;color:#9ca3af;">Sex</p>
              <p style="margin:3px 0 0;font-size:14px;color:#111;">${sex}</p>
            </td>
            <td width="50%" style="vertical-align:top;padding-bottom:14px;">
              <p style="margin:0;font-size:10.5px;font-weight:600;text-transform:uppercase;letter-spacing:0.4px;color:#9ca3af;">Neutered / Spayed</p>
              <p style="margin:3px 0 0;font-size:14px;color:#111;">${neutered}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    ${message ? `
    <!-- Divider -->
    <tr><td style="padding:4px 28px 0;"><hr style="border:none;border-top:1px solid #f3f4f6;margin:0;"></td></tr>

    <!-- Notes -->
    <tr>
      <td style="padding:16px 28px 0;">
        <p style="margin:0 0 8px;font-size:10px;font-weight:700;letter-spacing:0.8px;text-transform:uppercase;color:#9ca3af;">Notes from owner</p>
        <p style="margin:0;font-size:14px;color:#111;line-height:1.6;background:#f9fafb;border-radius:8px;padding:12px 14px;">${message.replace(/\n/g, "<br>")}</p>
      </td>
    </tr>` : ""}

    <!-- Divider -->
    <tr><td style="padding:20px 28px 0;"><hr style="border:none;border-top:1px solid #f3f4f6;margin:0;"></td></tr>

    <!-- Source -->
    <tr>
      <td style="padding:16px 28px 0;">
        <p style="margin:0 0 12px;font-size:10px;font-weight:700;letter-spacing:0.8px;text-transform:uppercase;color:#9ca3af;">Where they came from</p>
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
          <tr>
            <td width="50%" style="vertical-align:top;padding-bottom:14px;">
              <p style="margin:0;font-size:10.5px;font-weight:600;text-transform:uppercase;letter-spacing:0.4px;color:#9ca3af;">Came from</p>
              <p style="margin:3px 0 0;font-size:14px;color:#111;">${esc(cameFrom)}</p>
            </td>
            <td width="50%" style="vertical-align:top;padding-bottom:14px;">
              <p style="margin:0;font-size:10.5px;font-weight:600;text-transform:uppercase;letter-spacing:0.4px;color:#9ca3af;">How they said they heard</p>
              <p style="margin:3px 0 0;font-size:14px;color:#111;">${esc(theirAnswer)}</p>
            </td>
          </tr>
          <tr>
            <td colspan="2" style="vertical-align:top;padding-bottom:4px;">
              <p style="margin:0;font-size:10.5px;font-weight:600;text-transform:uppercase;letter-spacing:0.4px;color:#9ca3af;">First page they saw</p>
              <p style="margin:3px 0 0;font-size:14px;color:#111;">${esc(firstPage)}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="padding:24px 28px 28px;">
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
          <tr>
            <td style="border-top:1px solid #f3f4f6;padding-top:16px;">
              <p style="margin:0;font-size:11.5px;color:#9ca3af;">Submitted ${submittedAt} via duncansdogco.com</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>

  </table>
  <!-- /Card -->

</td></tr>
</table>
</body>
</html>`;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: "Duncan's Dog Co <forms@duncansdogco.com>",
        to:   ["info@duncansdogco.com"],
        reply_to: email !== "—" ? email : undefined,
        subject,
        html
      })
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Resend error:", err);
      return { statusCode: 500, body: err };
    }

    return { statusCode: 200, body: "OK" };

  } catch (err) {
    console.error("submission-created error:", err);
    return { statusCode: 500, body: err.message };
  }
};
