"use client";

/* True ILM — Eid gift cards.
   The card artwork is the exported image asset (see CARD_IMAGES); we layer the
   recipient/sender name overlay on top in code. */

import Image from "next/image";
import { CARD_IDS, CARD_IMAGES, CARD_TITLES, type CardId } from "./card-data";

export type { CardId } from "./card-data";

/* Per-card overlay colours (text + "a gift from" accent). */
const OVERLAY_COLORS: Record<CardId, { color: string; accent: string; shadow: boolean }> = {
  lantern: { color: "#FEF7E6", accent: "#F5D27A", shadow: true },
  skyline: { color: "#192351", accent: "#B5742A", shadow: false },
  ornament: { color: "#192351", accent: "#B5495A", shadow: false },
};

/* Card list for the colour picker (id + title). */
export const CARDS: { id: CardId; title: string }[] = CARD_IDS.map((id) => ({
  id,
  title: CARD_TITLES[id],
}));

/* Name overlay drawn on top of the card. The new artwork has the gift box at
   the bottom, so the name sits in the open upper band. */
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
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-body)",
          fontWeight: 900,
          fontSize: "min(8.5cqi, 76px)",
          color,
          lineHeight: 1.04,
          letterSpacing: "-0.5px",
          textAlign: "center",
          textShadow: shadow ? "0 4px 16px rgba(0,0,0,0.3)" : "none",
        }}
      >
        {recipient}
      </div>
      <div
        style={{
          marginTop: "1.6%",
          fontFamily: "var(--font-body)",
          fontWeight: 700,
          fontSize: "min(2.8cqi, 26px)",
          color: accent,
          letterSpacing: "2px",
          textTransform: "uppercase",
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
        width={1008}
        height={704}
        sizes="(max-width: 980px) 100vw, 560px"
        unoptimized
        priority
      />
      {showOverlay && recipient ? (
        <NameOverlay recipient={recipient} sender={sender ?? ""} color={ov.color} accent={ov.accent} shadow={ov.shadow} />
      ) : null}
    </div>
  );
}
