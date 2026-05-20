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

/* Exported card artwork (2160x1080, 2:1) used as the gift-card background. */
export const CARD_IMAGES: Record<CardId, string> = {
  lantern: "/card-lantern.png",
  skyline: "/card-skyline.png",
  ornament: "/card-blush.png",
};

/** Returns a valid CardId, defaulting to "lantern" for anything unknown. */
export function resolveCardId(id: string | null | undefined): CardId {
  return CARD_IDS.includes((id ?? "") as CardId) ? (id as CardId) : "lantern";
}
