/* Server-safe card metadata (no React, no "use client").
   Lets server components resolve a card id without importing the client
   card components. */

export type CardId = "lantern" | "skyline" | "ornament";

export const CARD_IDS: CardId[] = ["lantern", "skyline", "ornament"];

export const CARD_TITLES: Record<CardId, string> = {
  lantern: "Lantern Night",
  skyline: "Heritage Skyline",
  ornament: "Blush",
};

/* Card artwork (SVG, 1008x704) used as the gift-card background. */
export const CARD_IMAGES: Record<CardId, string> = {
  lantern: "/card-lantern.svg",
  skyline: "/card-skyline.svg",
  ornament: "/card-blush.svg",
};

export const CARD_W = 1008;
export const CARD_H = 704;

/** Returns a valid CardId, defaulting to "lantern" for anything unknown. */
export function resolveCardId(id: string | null | undefined): CardId {
  return CARD_IDS.includes((id ?? "") as CardId) ? (id as CardId) : "lantern";
}
