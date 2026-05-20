"use client";

/* True ILM — Eid gift cards.
   The card artwork is the exported image asset (see CARD_IMAGES); we layer the
   recipient/sender name overlay on top in code. */

import Image from "next/image";
import { CARD_IDS, CARD_IMAGES, CARD_TITLES, type CardId } from "./card-data";

export type { CardId } from "./card-data";

/* Per-card overlay colours (text + "a gift from" accent). */
const OVERLAY_COLORS: Record<CardId, { color: string; accent: string; shadow: boolean }> = {
  lantern: { color: "#FEF7E6", accent: "#EAC060", shadow: true },
  skyline: { color: "#192351", accent: "#192351", shadow: false },
  ornament: { color: "#192351", accent: "#B07069", shadow: false },
};

/* Card list for the colour picker (id + title). */
export const CARDS: { id: CardId; title: string }[] = CARD_IDS.map((id) => ({
  id,
  title: CARD_TITLES[id],
}));

/* ── Name overlay drawn on top of the card ────────────────────────────── */
function NameOverlay({
  recipient,
  sender,
  color,
  accent,
  shadow,
}: {
  recipient: string;
  sender: string;
  color: string;
  accent: string;
  shadow: boolean;
}) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
        padding: "0 8%",
        paddingTop: "4%",
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-body)",
          fontWeight: 900,
          fontSize: "min(8cqi, 72px)",
          color,
          lineHeight: 1.05,
          letterSpacing: "-0.5px",
          textAlign: "center",
          textShadow: shadow ? "0 4px 16px rgba(0,0,0,0.25)" : "none",
        }}
      >
        {recipient}
      </div>
      <div
        style={{
          marginTop: "1.4%",
          fontFamily: "var(--font-body)",
          fontWeight: 600,
          fontSize: "min(2.6cqi, 24px)",
          color: accent,
          letterSpacing: "2px",
          textTransform: "uppercase",
          opacity: 0.9,
        }}
      >
        A gift from {sender}
      </div>
    </div>
  );
}

/* The Heritage Skyline artwork is biased low (mosque silhouette), so its name
   overlay sits higher in the cream sky band. */
function SkylineOverlay({ recipient, sender, accent }: { recipient: string; sender: string; accent: string }) {
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: "38%",
        transform: "translateY(-50%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-body)",
          fontWeight: 900,
          fontSize: "min(8cqi, 72px)",
          color: "#192351",
          lineHeight: 1.05,
          letterSpacing: "-.5px",
          textAlign: "center",
          textShadow: "0 2px 12px rgba(254,247,230,.6)",
        }}
      >
        {recipient}
      </div>
      <div
        style={{
          marginTop: "1%",
          fontFamily: "var(--font-body)",
          fontWeight: 700,
          fontSize: "min(2.6cqi, 24px)",
          color: accent,
          letterSpacing: "2px",
          textTransform: "uppercase",
          opacity: 0.7,
        }}
      >
        A gift from {sender}
      </div>
    </div>
  );
}

/* A card "frame" — the artwork image plus an optional name overlay, fit to the
   parent. container-type: inline-size powers the overlay's cqi font sizing. */
export function CardFrame({
  id,
  recipient,
  sender,
  showOverlay = true,
  small = false,
}: {
  id: CardId;
  recipient?: string;
  sender?: string;
  showOverlay?: boolean;
  small?: boolean;
}) {
  const ov = OVERLAY_COLORS[id];
  return (
    <div className={"cardFrame" + (small ? " sm" : "")}>
      <Image
        className="cardImg"
        src={CARD_IMAGES[id]}
        alt="Eid gift card"
        width={2160}
        height={1080}
        sizes="(max-width: 980px) 100vw, 560px"
        priority
      />
      {showOverlay && recipient ? (
        id === "skyline" ? (
          <SkylineOverlay recipient={recipient} sender={sender ?? ""} accent={ov.accent} />
        ) : (
          <NameOverlay recipient={recipient} sender={sender ?? ""} color={ov.color} accent={ov.accent} shadow={ov.shadow} />
        )
      ) : null}
    </div>
  );
}
