import { MAX_FILE_BYTES, readFields, validateFields, validateFile } from "@/lib/validation/enquiry";

/**
 * Enquiry intake. Validates everything server-side and forwards the submission
 * to the management-approved recipient via ENQUIRY_WEBHOOK_URL (e.g. a CRM,
 * Zapier/Make hook or email service endpoint). Success is returned ONLY when
 * that delivery is confirmed — if no recipient is configured, the API says so.
 */

// Magic-number checks for the binary types we accept (extension alone is spoofable).
const SIGNATURES: Record<string, number[][]> = {
  pdf: [[0x25, 0x50, 0x44, 0x46]],
  png: [[0x89, 0x50, 0x4e, 0x47]],
  jpg: [[0xff, 0xd8, 0xff]],
  jpeg: [[0xff, 0xd8, 0xff]],
  docx: [[0x50, 0x4b, 0x03, 0x04]],
  xlsx: [[0x50, 0x4b, 0x03, 0x04]],
  doc: [[0xd0, 0xcf, 0x11, 0xe0]],
  xls: [[0xd0, 0xcf, 0x11, 0xe0]],
  dwg: [[0x41, 0x43, 0x31, 0x30]], // "AC10"
};

const hits = new Map<string, { count: number; reset: number }>();
const WINDOW_MS = 10 * 60 * 1000;
const LIMIT = 5;

function rateLimited(key: string) {
  const now = Date.now();
  const h = hits.get(key);
  if (!h || h.reset < now) {
    hits.set(key, { count: 1, reset: now + WINDOW_MS });
    return false;
  }
  h.count++;
  return h.count > LIMIT;
}

const json = (body: unknown, status: number) => Response.json(body, { status });

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (rateLimited(ip)) return json({ ok: false, error: "Too many submissions. Please try again later." }, 429);

  const length = Number(request.headers.get("content-length") ?? 0);
  if (length > MAX_FILE_BYTES + 256 * 1024) return json({ ok: false, error: "Submission is too large." }, 413);

  let fd: FormData;
  try {
    fd = await request.formData();
  } catch {
    return json({ ok: false, error: "Invalid submission." }, 400);
  }

  // Honeypot: real users never fill this hidden field.
  if (String(fd.get("website") ?? "") !== "") return json({ ok: false, error: "Submission rejected." }, 400);
  // Time trap: forms submitted faster than a human could fill them.
  const started = Number(fd.get("startedAt") ?? 0);
  if (!started || Date.now() - started < 3000) return json({ ok: false, error: "Submission rejected. Please try again." }, 400);

  const fields = readFields(fd);
  const errors = validateFields(fields);
  const doc = fd.get("document");
  const file = doc instanceof File && doc.size > 0 ? doc : null;
  const fileError = validateFile(file);
  if (fileError) errors.document = fileError;
  if (file && !fileError) {
    const ext = file.name.split(".").pop()!.toLowerCase();
    const head = new Uint8Array(await file.slice(0, 8).arrayBuffer());
    const ok = SIGNATURES[ext]?.some((sig) => sig.every((b, i) => head[i] === b));
    if (!ok) errors.document = "The file content does not match its type.";
  }
  if (Object.keys(errors).length) return json({ ok: false, errors }, 422);

  const webhook = process.env.ENQUIRY_WEBHOOK_URL;
  if (!webhook) {
    console.error("[enquiry] ENQUIRY_WEBHOOK_URL is not configured — enquiry NOT delivered.");
    return json(
      { ok: false, error: "Online enquiries are temporarily unavailable. Please contact us directly — your enquiry has not been sent." },
      503,
    );
  }

  try {
    const out = new FormData();
    for (const [k, v] of Object.entries(fields)) out.append(k, v);
    out.append("submittedAt", new Date().toISOString());
    if (file) out.append("document", file, file.name);
    const res = await fetch(webhook, {
      method: "POST",
      body: out,
      headers: process.env.ENQUIRY_WEBHOOK_TOKEN ? { Authorization: `Bearer ${process.env.ENQUIRY_WEBHOOK_TOKEN}` } : undefined,
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) throw new Error(`Recipient responded ${res.status}`);
  } catch (err) {
    console.error("[enquiry] delivery failed:", err);
    return json({ ok: false, error: "We could not deliver your enquiry. Please try again shortly — it has not been sent." }, 502);
  }

  return json({ ok: true }, 200);
}
