import type { Metadata, Viewport } from "next";
import { Nunito_Sans, Familjen_Grotesk, Amiri } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

/* Body — brand font */
const nunito = Nunito_Sans({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
  variable: "--font-nunito",
  display: "swap",
});

/* Display — closest free match for the brand's Conglomerate.
   Swap in an Adobe Fonts Conglomerate kit by prepending it to --font-display in globals.css. */
const familjen = Familjen_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-familjen",
  display: "swap",
});

/* Arabic greeting */
const amiri = Amiri({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-amiri",
  display: "swap",
});

/* Canonical domain — used to make OG/social image URLs absolute (required by
   WhatsApp & other crawlers). Production uses the custom domain; previews use
   their own URL; local dev uses localhost. */
const siteUrl =
  process.env.VERCEL_ENV === "production"
    ? "https://gift.trueilm.com"
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "True ILM · Send the gift of Eid",
  description:
    "Send an Eid gift card to a friend or family member. One month of Islamic audiobooks and eBooks, on us.",
  /* Default share thumbnail for the bare gift.trueilm.com link. The /gift page
     overrides this with a personalised version. */
  openGraph: {
    title: "Send a Free Personalised Eid Card",
    description:
      "Send an Eid gift card to a friend or family member. One month of Islamic audiobooks and eBooks, on us.",
    type: "website",
    url: "/",
    images: [
      {
        url: `/gift/og?c=lantern&title=${encodeURIComponent("Send a Free Personalised Eid Card")}`,
        width: 1200,
        height: 630,
        alt: "Send a Free Personalised Eid Card",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Send a Free Personalised Eid Card",
    description:
      "Send an Eid gift card to a friend or family member. One month of Islamic audiobooks and eBooks, on us.",
    images: [`/gift/og?c=lantern&title=${encodeURIComponent("Send a Free Personalised Eid Card")}`],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#FEF7E6",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${nunito.variable} ${familjen.variable} ${amiri.variable}`}>
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
