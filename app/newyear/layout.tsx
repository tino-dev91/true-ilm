import type { Metadata } from "next";

/* Page-level metadata for the New Year "gift of knowledge" flow. metadataBase
   is inherited from the root layout, so relative OG URLs resolve correctly. The
   creator page is a client component, so its share thumbnail lives here. */
const ogTitle = "Send a Free Gift of Knowledge This New Year";
const ogImage = `/newyear/gift/og?c=lantern&title=${encodeURIComponent(ogTitle)}`;

export const metadata: Metadata = {
  title: "True ILM · Send the gift of knowledge",
  description:
    "Gift someone the book Muharram and 30 days of True ILM Pro, completely free. Help them start the new Islamic year with beneficial knowledge.",
  openGraph: {
    title: ogTitle,
    description:
      "Gift the book Muharram and 30 days of True ILM Pro, completely free, with a hadith on seeking knowledge attached.",
    type: "website",
    url: "/newyear",
    images: [{ url: ogImage, width: 1200, height: 630, alt: ogTitle }],
  },
  twitter: {
    card: "summary_large_image",
    title: ogTitle,
    description:
      "Gift the book Muharram and 30 days of True ILM Pro, completely free, with a hadith on seeking knowledge attached.",
    images: [ogImage],
  },
};

export default function NewYearLayout({ children }: { children: React.ReactNode }) {
  return children;
}
