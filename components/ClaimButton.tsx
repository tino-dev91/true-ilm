"use client";

import { track } from "@vercel/analytics";
import { logEvent } from "@/lib/track";
import { ArrowIcon } from "./icons";

const CLAIM_URL = "https://redirect.appmetrica.yandex.com/serve/821977019486082306";

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
      }}
    >
      Claim your free month
      <ArrowIcon stroke="#EAC060" />
    </a>
  );
}
