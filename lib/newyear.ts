import type { CardId } from "@/components/card-data";
import { DEFAULT_HADITH_ID } from "@/lib/hadith";

export type SendMethod = "whatsapp" | "email" | "link";

export interface NewYearGift {
  card: CardId;
  to: string;
  from: string;
  note: string;
  method: SendMethod;
  /** id of a shortlisted hadith (ignored when customHadith is set) */
  hadithId: string;
  /** sender's own quote, takes precedence over hadithId when non-empty */
  customHadith: string;
  /** optional attribution for the custom quote */
  customSource: string;
}

export const DEFAULT_NOTE =
  "Wishing you a blessed new Islamic year, may it be filled with beneficial knowledge.";

/** Build the shareable recipient URL for a New Year gift. */
export function buildGiftUrl(gift: NewYearGift, origin: string): string {
  const params = new URLSearchParams({
    c: gift.card,
    to: gift.to,
    from: gift.from,
  });
  if (gift.note && gift.note !== DEFAULT_NOTE) params.set("note", gift.note);

  const custom = gift.customHadith.trim();
  if (custom) {
    params.set("hq", custom);
    if (gift.customSource.trim()) params.set("hs", gift.customSource.trim());
  } else if (gift.hadithId && gift.hadithId !== DEFAULT_HADITH_ID) {
    params.set("h", gift.hadithId);
  }

  return `${origin}/newyear/gift?${params.toString()}`;
}

/** Compose the outbound share action for the chosen send method. */
export function buildShareAction(
  gift: NewYearGift,
  giftUrl: string,
): { kind: "href"; href: string } | { kind: "copy"; text: string } {
  const greeting = `Happy New Islamic Year${gift.to ? `, ${gift.to}` : ""}! I've got a gift for you. The book Muharram and 30 days of True ILM Pro, completely free. Open it here:`;
  const message = `${greeting} ${giftUrl}`;

  switch (gift.method) {
    case "whatsapp":
      return { kind: "href", href: `https://wa.me/?text=${encodeURIComponent(message)}` };
    case "email": {
      const subject = `A New Year gift of knowledge for you${gift.to ? `, ${gift.to}` : ""}`;
      return {
        kind: "href",
        href: `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`,
      };
    }
    case "link":
    default:
      return { kind: "copy", text: giftUrl };
  }
}
