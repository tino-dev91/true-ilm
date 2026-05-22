import type { CardId } from "@/components/cards";

export interface Gift {
  card: CardId;
  to: string;
  from: string;
  note: string;
  method: SendMethod;
}

export type SendMethod = "whatsapp" | "email" | "link";

export const DEFAULT_NOTE =
  "Eid Mubarak. Wishing you a blessed month, with knowledge as your companion.";

/** Build the shareable recipient URL for a gift. */
export function buildGiftUrl(gift: Gift, origin: string): string {
  const params = new URLSearchParams({
    c: gift.card,
    to: gift.to,
    from: gift.from,
  });
  if (gift.note && gift.note !== DEFAULT_NOTE) params.set("note", gift.note);
  return `${origin}/gift?${params.toString()}`;
}

/** Compose the outbound share action for the chosen send method. */
export function buildShareAction(
  gift: Gift,
  giftUrl: string,
): { kind: "href"; href: string } | { kind: "copy"; text: string } {
  const greeting = `Eid Mubarak${gift.to ? `, ${gift.to}` : ""}! I've got a little Eid gift for you, from me to you. Open it here:`;
  const message = `${greeting} ${giftUrl}`;

  switch (gift.method) {
    case "whatsapp":
      return { kind: "href", href: `https://wa.me/?text=${encodeURIComponent(message)}` };
    case "email": {
      const subject = `An Eid gift for you${gift.to ? `, ${gift.to}` : ""}`;
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
