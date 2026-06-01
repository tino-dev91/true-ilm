import { getRedis, SHARE_METHODS, CARD_KEYS, SHARE_SOURCES } from "@/lib/redis";

export const runtime = "nodejs";

/* Increments self-hosted counters in Upstash Redis. Validates inputs against
   known values so keys can't be injected. No-ops gracefully if Redis isn't
   configured yet. */
export async function POST(req: Request) {
  const redis = getRedis();
  if (!redis) return Response.json({ ok: false, reason: "not-configured" });

  let body: { event?: string; method?: string; card?: string; source?: string; key?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false, reason: "bad-body" }, { status: 400 });
  }

  const card = CARD_KEYS.includes(body.card as never) ? body.card : null;

  // Secret-gated reset (e.g. before launch): { event:"__reset__", key:STATS_KEY }
  if (body.event === "__reset__") {
    if (!process.env.STATS_KEY || body.key !== process.env.STATS_KEY) {
      return Response.json({ ok: false }, { status: 403 });
    }
    const keys = [
      "gift_share:total",
      ...SHARE_METHODS.map((m) => `gift_share:method:${m}`),
      ...CARD_KEYS.map((c) => `gift_share:card:${c}`),
      ...SHARE_SOURCES.map((s) => `gift_share:source:${s}`),
      "claim_free_month:total",
      ...CARD_KEYS.map((c) => `claim_free_month:card:${c}`),
    ];
    await redis.del(...keys);
    return Response.json({ ok: true, reset: true });
  }

  if (body.event === "gift_share") {
    const method = SHARE_METHODS.includes(body.method as never) ? body.method : null;
    const source = SHARE_SOURCES.includes(body.source as never) ? body.source : null;
    await redis.incr("gift_share:total");
    if (method) await redis.incr(`gift_share:method:${method}`);
    if (card) await redis.incr(`gift_share:card:${card}`);
    if (source) await redis.incr(`gift_share:source:${source}`);
  } else if (body.event === "claim_free_month") {
    await redis.incr("claim_free_month:total");
    if (card) await redis.incr(`claim_free_month:card:${card}`);
  } else {
    return Response.json({ ok: false, reason: "unknown-event" }, { status: 400 });
  }

  return Response.json({ ok: true });
}
