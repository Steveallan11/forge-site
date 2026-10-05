const MAX_TEXT = 500;

function text(value, limit = MAX_TEXT) {
  return typeof value === "string" ? value.trim().slice(0, limit) : "";
}

function list(value) {
  return Array.isArray(value) ? value.slice(0, 12).map((item) => text(item, 120)).filter(Boolean) : [];
}

module.exports = async function blueprintEndpoint(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return response.status(405).json({ ok: false, error: "method_not_allowed" });
  }

  let body;
  try {
    body = typeof request.body === "string" ? JSON.parse(request.body || "{}") : (request.body || {});
  } catch {
    return response.status(400).json({ ok: false, error: "invalid_json" });
  }

  // Quietly accept bots that fill the hidden field without forwarding anything.
  if (text(body.website, 200)) return response.status(200).json({ ok: true });

  const enquiry = {
    name: text(body.name, 100),
    company: text(body.company, 120),
    email: text(body.email, 160),
    phone: text(body.phone, 40),
    trade: text(body.trade, 80),
    teamSize: text(body.teamSize, 40),
    tools: list(body.tools),
    pain: text(body.pain, 160),
    modules: text(body.modules),
    priorities: list(body.priorities),
    source: "forge-blueprint-v1",
    submittedAt: new Date().toISOString()
  };

  if (!enquiry.name || !enquiry.company || !enquiry.email || !enquiry.trade || !enquiry.teamSize || !enquiry.pain || !enquiry.tools.length) {
    return response.status(400).json({ ok: false, error: "invalid_blueprint" });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(enquiry.email)) {
    return response.status(400).json({ ok: false, error: "invalid_email" });
  }

  const destination = process.env.BLUEPRINT_WEBHOOK_URL;
  if (!destination) {
    return response.status(503).json({ ok: false, error: "enquiry_destination_not_configured" });
  }

  try {
    const upstream = await fetch(destination, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(enquiry),
      signal: AbortSignal.timeout(8000)
    });

    if (!upstream.ok) return response.status(502).json({ ok: false, error: "enquiry_destination_failed" });
    return response.status(200).json({ ok: true });
  } catch (error) {
    console.error("Blueprint delivery failed", error instanceof Error ? error.message : "unknown_error");
    return response.status(502).json({ ok: false, error: "enquiry_delivery_failed" });
  }
};
