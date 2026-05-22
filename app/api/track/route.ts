import { getRedis, SHARE_METHODS, CARD_KEYS } from "@/lib/redis";

export const runtime = "nodejs";

/* Increments self-hosted counters in Upstash Redis. Validates inputs against
   known values so keys can't be injected. No-ops gracefully if Redis isn't
   configured yet. */
export async function POST(req: Request) {
  const redis = getRedis();
  if (!redis) return Response.json({ ok: false, reason: "not-configured" });

  let body: { event?: string; method?: string; card?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false, reason: "bad-body" }, { status: 400 });
  }

  const card = CARD_KEYS.includes(body.card as never) ? body.card : null;

  if (body.event === "gift_share") {
    const method = SHARE_METHODS.includes(body.method as never) ? body.method : null;
    await redis.incr("gift_share:total");
    if (method) await redis.incr(`gift_share:method:${method}`);
    if (card) await redis.incr(`gift_share:card:${card}`);
  } else if (body.event === "claim_free_month") {
    await redis.incr("claim_free_month:total");
    if (card) await redis.incr(`claim_free_month:card:${card}`);
  } else {
    return Response.json({ ok: false, reason: "unknown-event" }, { status: 400 });
  }

  return Response.json({ ok: true });
}
