import { notFound } from "next/navigation";
import { getRedis, SHARE_METHODS, CARD_KEYS, SHARE_SOURCES } from "@/lib/redis";

export const dynamic = "force-dynamic";
export const metadata = { robots: { index: false, follow: false } };

type SearchParams = Promise<{ key?: string }>;

const n = (v: unknown) => (typeof v === "number" ? v : Number(v) || 0);

export default async function StatsPage({ searchParams }: { searchParams: SearchParams }) {
  const { key } = await searchParams;
  // Private: only viewable with the correct ?key=… (STATS_KEY env). Blocked if unset.
  if (!process.env.STATS_KEY || key !== process.env.STATS_KEY) notFound();

  const redis = getRedis();
  if (!redis) {
    return (
      <main style={{ fontFamily: "system-ui", padding: 40, maxWidth: 640 }}>
        <h1>Gift stats</h1>
        <p>Redis isn&apos;t connected yet. Provision Upstash Redis on the Vercel project and redeploy.</p>
      </main>
    );
  }

  const keys = [
    "gift_share:total",
    ...SHARE_METHODS.map((m) => `gift_share:method:${m}`),
    ...CARD_KEYS.map((c) => `gift_share:card:${c}`),
    ...SHARE_SOURCES.map((s) => `gift_share:source:${s}`),
    "claim_free_month:total",
    ...CARD_KEYS.map((c) => `claim_free_month:card:${c}`),
  ];
  const vals = (await redis.mget<(number | null)[]>(...keys)).map(n);
  const m: Record<string, number> = {};
  keys.forEach((k, i) => (m[k] = vals[i]));

  const shareTotal = m["gift_share:total"];
  const claimTotal = m["claim_free_month:total"];
  const rate = shareTotal ? ((claimTotal / shareTotal) * 100).toFixed(1) + "%" : "—";

  /* Source counters started ticking when referral tracking shipped, so they
     sum to less than gift_share:total when older shares exist. Use the sum as
     the denominator for share-of-tracked so % is honest. */
  const sourceTracked = SHARE_SOURCES.reduce((sum, s) => sum + m[`gift_share:source:${s}`], 0);
  const sourcePct = (v: number) => (sourceTracked ? ((v / sourceTracked) * 100).toFixed(1) + "%" : "—");
  const SOURCE_LABELS: Record<(typeof SHARE_SOURCES)[number], string> = {
    direct: "Direct (no referral)",
    ref: "Referred (visited a gift)",
    ref_claim: "Referred + claimed",
  };

  const cell: React.CSSProperties = { padding: "10px 14px", borderBottom: "1px solid #eee" };
  const num: React.CSSProperties = { ...cell, textAlign: "right", fontVariantNumeric: "tabular-nums", fontWeight: 700 };

  return (
    <main style={{ fontFamily: "system-ui, sans-serif", padding: 40, maxWidth: 680, color: "#192351" }}>
      <h1 style={{ marginBottom: 4 }}>Gift stats</h1>
      <p style={{ color: "#666", marginTop: 0 }}>Live counters · True ILM Eid gift</p>

      <div style={{ display: "flex", gap: 16, margin: "24px 0" }}>
        <Stat label="Gifts shared" value={shareTotal} />
        <Stat label="Claims" value={claimTotal} />
        <Stat label="Claim rate" value={rate} />
      </div>

      <h2 style={{ fontSize: 16 }}>Shares by channel</h2>
      <table style={{ borderCollapse: "collapse", width: "100%", marginBottom: 28 }}>
        <tbody>
          {SHARE_METHODS.map((mtd) => (
            <tr key={mtd}>
              <td style={cell}>{mtd === "link" ? "Copy link" : mtd[0].toUpperCase() + mtd.slice(1)}</td>
              <td style={num}>{m[`gift_share:method:${mtd}`]}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 style={{ fontSize: 16 }}>Shares by source</h2>
      <p style={{ color: "#888", fontSize: 12, marginTop: -4 }}>
        Tracked: {sourceTracked} of {shareTotal} shares (referral tracking added later — earlier shares have no source).
      </p>
      <table style={{ borderCollapse: "collapse", width: "100%", marginBottom: 28 }}>
        <thead>
          <tr>
            <td style={{ ...cell, fontWeight: 700 }}>Source</td>
            <td style={{ ...num, color: "#666" }}>Shares</td>
            <td style={{ ...num, color: "#666" }}>% of tracked</td>
          </tr>
        </thead>
        <tbody>
          {SHARE_SOURCES.map((s) => {
            const v = m[`gift_share:source:${s}`];
            return (
              <tr key={s}>
                <td style={cell}>{SOURCE_LABELS[s]}</td>
                <td style={num}>{v}</td>
                <td style={num}>{sourcePct(v)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <h2 style={{ fontSize: 16 }}>By card design</h2>
      <table style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            <td style={{ ...cell, fontWeight: 700 }}>Card</td>
            <td style={{ ...num, color: "#666" }}>Shared</td>
            <td style={{ ...num, color: "#666" }}>Claimed</td>
          </tr>
        </thead>
        <tbody>
          {CARD_KEYS.map((c) => (
            <tr key={c}>
              <td style={cell}>{c[0].toUpperCase() + c.slice(1)}</td>
              <td style={num}>{m[`gift_share:card:${c}`]}</td>
              <td style={num}>{m[`claim_free_month:card:${c}`]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div style={{ flex: 1, border: "1px solid #e2d9c5", borderRadius: 12, padding: "16px 18px", background: "#fffaee" }}>
      <div style={{ fontSize: 28, fontWeight: 800 }}>{value}</div>
      <div style={{ fontSize: 12, color: "#666", textTransform: "uppercase", letterSpacing: 1 }}>{label}</div>
    </div>
  );
}
