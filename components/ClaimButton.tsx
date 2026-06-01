"use client";

import { track } from "@vercel/analytics";
import { logEvent } from "@/lib/track";
import { ArrowIcon } from "./icons";

const CLAIM_URL = "https://4711657.redirect.appmetrica.yandex.com/paywall/eid_30_days?appmetrica_tracking_id=1038659881009228825&referrer=reattribution%3D1";

/* "Claim your free month" — fires a custom analytics event on click, then opens
   the app deep link. */
export function ClaimButton({ card }: { card: string }) {
  return (
    <a
      className="recv-cta-btn"
      href={CLAIM_URL}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => {
        track("claim_free_month", { card });
        logEvent("claim_free_month", { card });
        try {
          localStorage.setItem("tilm_claimed", "1");
        } catch {
          /* private mode / storage disabled — best-effort signal only */
        }
      }}
    >
      Claim your free month
      <ArrowIcon stroke="#EAC060" />
    </a>
  );
}
