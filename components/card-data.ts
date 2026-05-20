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

/** Returns a valid CardId, defaulting to "lantern" for anything unknown. */
export function resolveCardId(id: string | null | undefined): CardId {
  return CARD_IDS.includes((id ?? "") as CardId) ? (id as CardId) : "lantern";
}
