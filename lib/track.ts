/* Client-side event logger. Posts to our own /api/track (self-hosted counters)
   via sendBeacon so it survives navigation (e.g. opening the claim deep link). */
export function logEvent(event: string, data: Record<string, string> = {}) {
  if (typeof navigator === "undefined") return;
  const body = JSON.stringify({ event, ...data });
  try {
    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/track", new Blob([body], { type: "application/json" }));
    } else {
      void fetch("/api/track", {
        method: "POST",
        body,
        headers: { "content-type": "application/json" },
        keepalive: true,
      });
    }
  } catch {
    /* analytics must never break the UX */
  }
}
