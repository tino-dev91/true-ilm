import { Redis } from "@upstash/redis";

/* Returns an Upstash Redis client if credentials are configured, else null so
   the app keeps working before the integration is provisioned. Supports both
   the UPSTASH_* and KV_* env var names the Vercel Marketplace may set. */
export function getRedis(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

export const SHARE_METHODS = ["whatsapp", "email", "link"] as const;
export const CARD_KEYS = ["lantern", "skyline", "ornament"] as const;
export const SHARE_SOURCES = ["direct", "ref", "ref_claim"] as const;

/* Counters are namespaced per campaign so each gift flow has its own stats.
   Eid is intentionally unprefixed to preserve the existing keys and accumulated
   data; new campaigns get a "<campaign>:" prefix. */
export const CAMPAIGNS = ["eid", "newyear"] as const;
export type Campaign = (typeof CAMPAIGNS)[number];

export function campaignPrefix(campaign: string | null | undefined): string {
  return campaign === "newyear" ? "newyear:" : "";
}
