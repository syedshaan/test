export function sendJson(res, status, body) {
  res.status(status).setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(body));
}

export function getRequestData(req) {
  if (req.body && typeof req.body === "object") return req.body;
  if (typeof req.body === "string") {
    try {
      return JSON.parse(req.body);
    } catch {
      return null;
    }
  }
  return null;
}

export function isSameOrigin(req) {
  const origin = req.headers.origin;
  const host = req.headers.host;
  if (typeof origin !== "string" || typeof host !== "string") return false;

  try {
    const originUrl = new URL(origin);
    const isLocal = host.startsWith("localhost:") || host.startsWith("127.0.0.1:");
    return (
      originUrl.host.toLowerCase() === host.toLowerCase() &&
      (originUrl.protocol === "https:" || (isLocal && originUrl.protocol === "http:"))
    );
  } catch {
    return false;
  }
}

export function getClientIp(req) {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded) return forwarded.split(",")[0].trim();
  return req.socket?.remoteAddress || "unknown";
}

const memoryBuckets = new Map();

async function upstashIncrement(key, windowSeconds) {
  const base = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  const response = await fetch(`${base}/pipeline`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify([
      ["INCR", key],
      ["EXPIRE", key, windowSeconds, "NX"],
    ]),
  });
  if (!response.ok) throw new Error(`Upstash HTTP ${response.status}`);
  const result = await response.json();
  return Number(result?.[0]?.result);
}

function memoryIncrement(key, windowSeconds) {
  const now = Date.now();
  const bucket = memoryBuckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    memoryBuckets.set(key, { count: 1, resetAt: now + windowSeconds * 1000 });
    if (memoryBuckets.size > 5000) {
      for (const [k, v] of memoryBuckets) if (v.resetAt <= now) memoryBuckets.delete(k);
    }
    return 1;
  }
  bucket.count += 1;
  return bucket.count;
}

/**
 * Returns true when the caller is within the limit.
 * Uses Upstash Redis when UPSTASH_REDIS_REST_URL/TOKEN are set (shared across
 * serverless instances); otherwise falls back to a per-instance memory counter,
 * which is only best-effort protection.
 */
export async function withinRateLimit(req, name, limit, windowSeconds) {
  const key = `rl:${name}:${getClientIp(req)}`;
  try {
    const count =
      process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
        ? await upstashIncrement(key, windowSeconds)
        : memoryIncrement(key, windowSeconds);
    return count <= limit;
  } catch (error) {
    console.error("[rate-limit] check failed:", error instanceof Error ? error.message : "unknown");
    return memoryIncrement(key, windowSeconds) <= limit;
  }
}

/**
 * Verifies a Cloudflare Turnstile token when TURNSTILE_SECRET_KEY is set.
 * If the secret is not set, verification is skipped.
 */
export async function verifyTurnstile(req, token) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;
  if (typeof token !== "string" || !token) return false;
  try {
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: token, remoteip: getClientIp(req) }),
    });
    const result = await response.json();
    return result?.success === true;
  } catch {
    return false;
  }
}
