import Image from "next/image";
import Link from "next/link";
import { CardFrame } from "@/components/cards";
import { resolveCardId } from "@/components/card-data";
import { BooksMarquee } from "@/components/BooksMarquee";
import { ArrowIcon } from "@/components/icons";
import { DEFAULT_NOTE } from "@/lib/gift";

type SearchParams = Promise<{ c?: string; to?: string; from?: string; note?: string }>;

export async function generateMetadata({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const card = resolveCardId(sp.c);
  const to = (sp.to ?? "").trim();
  const from = (sp.from ?? "").trim();

  const title = to ? `${to}, you have an Eid gift. Open up!` : "You have an Eid gift. Open up!";
  const description = from
    ? `${from} sent you a little Eid gift. Open it up to see what's inside.`
    : "A little Eid gift, just for you. Open it up to see what's inside.";

  /* OG image + canonical link carry the same gift params so the preview is personalised. */
  const q = new URLSearchParams({ c: card });
  if (to) q.set("to", to);
  if (from) q.set("from", from);
  const ogImage = `/gift/og?${q.toString()}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: `/gift?${q.toString()}`,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image" as const,
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function GiftPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const card = resolveCardId(sp.c);
  const to = (sp.to ?? "").trim();
  const from = (sp.from ?? "").trim();
  const note = (sp.note ?? "").trim() || DEFAULT_NOTE;

  const stats = (
    <>
      <div className="recv-stat">
        <div className="n">500+</div>
        <div className="l">eBooks</div>
      </div>
      <div className="recv-stat">
        <div className="n">250+</div>
        <div className="l">Audiobooks</div>
      </div>
      <div className="recv-stat">
        <div className="n">30</div>
        <div className="l">Days free</div>
      </div>
    </>
  );

  return (
    <>
      {/* ── DESKTOP: split-screen ─────────────────────────────────── */}
      <div className="recv-page-d desktop-only">
        <div className="ds">
          <div className="ds-left">
            <div className="ds-brand">
              <Image src="/true-ilm-logo.svg" alt="True ILM" width={120} height={36} priority />
            </div>

            <h1 className="ds-h1">
              {to ? `${to}, ` : ""}
              <em>you&apos;ve got a gift.</em>
            </h1>
            <span className="recv-from">
              <span className="dot" />
              From {from || "a friend"}
            </span>

            <div className="note-card">
              <div className="from-label">A note from {from || "a friend"}</div>
              <p className="note-text">{note}</p>
              <div className="sig">— {from || "Abdullah"}</div>
            </div>

            <div className="ds-label">What&apos;s inside</div>
            <div className="recv-stats">{stats}</div>

            <div className="recv-claim">
              <a className="recv-cta-btn" href="https://redirect.appmetrica.yandex.com/serve/821977019486082306" target="_blank" rel="noopener noreferrer">
                Claim your free month
                <ArrowIcon stroke="#EAC060" />
              </a>
              <Link className="recv-cta-btn outline" href="/">
                Send your own Eid gift
              </Link>
              <p className="recv-cta-sub">Opens the True ILM app on iOS &amp; Android.</p>
            </div>

            <div className="recv-trust">
              <span className="stars">★★★★★</span>
              <span>160,000+ Muslims · 185 countries</span>
            </div>
          </div>

          <div className="ds-right">
            <div className="ds-card-stage">
              <CardFrame id={card} recipient={to} sender={from} showOverlay={Boolean(to)} />
              <div className="ds-card-caption">
                Your gift from <b>{from || "a friend"}</b>
              </div>
            </div>
          </div>
        </div>

        <BooksMarquee label="Your library awaits" />
      </div>

      {/* ── MOBILE: phone ─────────────────────────────────────────── */}
      <div className="recv-page mobile-only">
        <div className="phone">
          <div className="appbar">
            <div className="brand">
              <Image src="/true-ilm-logo.svg" alt="True ILM" width={96} height={24} priority />
            </div>
          </div>

          <div className="recv-greet">
            <div className="ar">عيد مبارك</div>
            <h1>{to ? `${to}, you've got a gift.` : "You've got a gift."}</h1>
            <span className="from">
              <span className="dot" />
              From {from || "a friend"}
            </span>
          </div>

          <div className="recv-preview-wrap">
            <div className="frameWrap">
              <CardFrame id={card} recipient={to} sender={from} showOverlay={Boolean(to)} />
            </div>
          </div>

          <div className="note-card">
            <div className="from-label">A note from {from || "a friend"}</div>
            <p className="note-text">{note}</p>
            <div className="sig">— {from || "Abdullah"}</div>
          </div>

          <div className="secLabel" style={{ textAlign: "center", margin: "22px 22px 12px" }}>
            What&apos;s inside
          </div>
          <div className="recv-stats">{stats}</div>

          <div className="recv-cta">
            <a className="recv-cta-btn" href="https://redirect.appmetrica.yandex.com/serve/821977019486082306" target="_blank" rel="noopener noreferrer">
              Claim your free month
              <ArrowIcon stroke="#EAC060" />
            </a>
            <Link className="recv-cta-btn outline" href="/">
              Send your own Eid gift
            </Link>
            <p className="recv-cta-sub">Opens the True ILM app on iOS &amp; Android.</p>
          </div>

          <BooksMarquee label="Your library awaits" />

          <div className="trust">
            <span className="stars">★★★★★</span>
            <span>160,000+ Muslims · 185 countries</span>
          </div>
        </div>
      </div>
    </>
  );
}
