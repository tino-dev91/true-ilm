import Image from "next/image";
import Link from "next/link";
import { NewYearCardFrame } from "@/components/newyear-cards";
import { resolveCardId } from "@/components/card-data";
import { BooksMarquee } from "@/components/BooksMarquee";
import { ClaimButton } from "@/components/ClaimButton";
import { resolveHadith } from "@/lib/hadith";
import { DEFAULT_NOTE } from "@/lib/newyear";

type SearchParams = Promise<{
  c?: string;
  to?: string;
  from?: string;
  note?: string;
  h?: string;
  hq?: string;
  hs?: string;
}>;

export async function generateMetadata({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const card = resolveCardId(sp.c);
  const to = (sp.to ?? "").trim();
  const from = (sp.from ?? "").trim();

  const title = to
    ? `${to}, you have a gift of knowledge. Open up!`
    : "You have a gift of knowledge. Open up!";
  const description = from
    ? `${from} sent you the book Muharram and 30 days of True ILM Pro, free. Open it up.`
    : "The book Muharram and 30 days of True ILM Pro, free. Open it up to see what's inside.";

  const q = new URLSearchParams({ c: card });
  if (to) q.set("to", to);
  if (from) q.set("from", from);
  const ogImage = `/newyear/gift/og?${q.toString()}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: `/newyear/gift?${q.toString()}`,
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

export default async function NewYearGiftPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const card = resolveCardId(sp.c);
  const to = (sp.to ?? "").trim();
  const from = (sp.from ?? "").trim();
  const note = (sp.note ?? "").trim() || DEFAULT_NOTE;
  const hadith = resolveHadith(sp.h, sp.hq, sp.hs);

  const stats = (
    <>
      <div className="recv-stat">
        <div className="n">Muharram</div>
        <div className="l">The book</div>
      </div>
      <div className="recv-stat">
        <div className="n">30</div>
        <div className="l">Days Pro free</div>
      </div>
      <div className="recv-stat">
        <div className="n">750+</div>
        <div className="l">Books &amp; audio</div>
      </div>
    </>
  );

  const bookFeature = (
    <div className="recv-book">
      <Image
        className="recv-book-img"
        src="/muharram-book.png"
        alt="A Journey through Muharram: The Month of Allah"
        width={600}
        height={830}
        priority
      />
    </div>
  );

  const hadithCard = (
    <div className="hadith-card">
      <div className="hadith-card-label">A hadith on seeking knowledge</div>
      {hadith.ar && (
        <p className="hadith-card-ar" lang="ar" dir="rtl">
          {hadith.ar}
        </p>
      )}
      <p className="hadith-card-en">“{hadith.en}”</p>
      {hadith.source && <p className="hadith-card-src">{hadith.source}</p>}
    </div>
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
              <em>you&apos;ve got a gift of knowledge.</em>
            </h1>
            <span className="recv-from">
              <span className="dot" />
              From {from || "a friend"}
            </span>

            <div className="note-card">
              <div className="from-label">A note from {from || "a friend"}</div>
              <p className="note-text">{note}</p>
              <div className="sig">{from || "Abdullah"}</div>
            </div>

            {hadithCard}

            <div className="ds-label">What&apos;s inside</div>
            {bookFeature}
            <div className="recv-stats">{stats}</div>

            <div className="recv-claim">
              <ClaimButton card={card} campaign="newyear" />
              <Link className="recv-cta-btn outline" href="/newyear?ref=g">
                Send your own gift
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
              <NewYearCardFrame id={card} recipient={to} sender={from} showOverlay={Boolean(to)} />
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
            <div className="ar">عَامٌ هِجْرِيٌّ جَدِيد</div>
            <h1>{to ? `${to}, you've got a gift of knowledge.` : "You've got a gift of knowledge."}</h1>
            <span className="from">
              <span className="dot" />
              From {from || "a friend"}
            </span>
          </div>

          <div className="recv-preview-wrap">
            <div className="frameWrap">
              <NewYearCardFrame id={card} recipient={to} sender={from} showOverlay={Boolean(to)} />
            </div>
          </div>

          <div className="note-card">
            <div className="from-label">A note from {from || "a friend"}</div>
            <p className="note-text">{note}</p>
            <div className="sig">{from || "Abdullah"}</div>
          </div>

          {hadithCard}

          <div className="secLabel" style={{ textAlign: "center", margin: "22px 22px 12px" }}>
            What&apos;s inside
          </div>
          {bookFeature}
          <div className="recv-stats">{stats}</div>

          <div className="recv-cta">
            <ClaimButton card={card} campaign="newyear" />
            <Link className="recv-cta-btn outline" href="/newyear?ref=g">
              Send your own gift
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
