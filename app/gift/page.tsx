import Image from "next/image";
import Link from "next/link";
import { CardFrame, getCard, type CardId } from "@/components/cards";
import { BooksMarquee } from "@/components/BooksMarquee";
import { ArrowIcon } from "@/components/icons";
import { DEFAULT_NOTE } from "@/lib/gift";

export const metadata = {
  title: "You've got an Eid gift · True ILM",
};

type SearchParams = Promise<{ c?: string; to?: string; from?: string; note?: string }>;

export default async function GiftPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const card = getCard(sp.c).id as CardId;
  const to = (sp.to ?? "").trim();
  const from = (sp.from ?? "").trim();
  const note = (sp.note ?? "").trim() || DEFAULT_NOTE;

  return (
    <div className="recv-page">
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
        <div className="recv-stats">
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
        </div>

        <div className="recv-cta">
          <a className="recv-cta-btn" href="https://trueilm.com" target="_blank" rel="noopener noreferrer">
            Claim your free month
            <ArrowIcon stroke="#EAC060" />
          </a>
          <p className="recv-cta-sub">Opens the True ILM app on iOS &amp; Android.</p>
        </div>

        <BooksMarquee label="Your library awaits" />

        <div className="trust">
          <span className="stars">★★★★★</span>
          <span>160,000+ Muslims · 185 countries</span>
        </div>

        <div style={{ textAlign: "center", paddingBottom: 8 }}>
          <Link className="text-link" href="/">
            Send your own Eid gift →
          </Link>
        </div>
      </div>
    </div>
  );
}
