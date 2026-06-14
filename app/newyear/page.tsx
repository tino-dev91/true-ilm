"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { track } from "@vercel/analytics";
import { logEvent } from "@/lib/track";
import { CARDS, NewYearCardFrame, type CardId } from "@/components/newyear-cards";
import { BooksMarquee } from "@/components/BooksMarquee";
import { HadithPicker } from "@/components/HadithPicker";
import { WhatsAppIcon } from "@/components/icons";
import { resolveHadith, DEFAULT_HADITH_ID, type Hadith } from "@/lib/hadith";
import {
  DEFAULT_NOTE,
  buildGiftUrl,
  buildShareAction,
  type NewYearGift,
  type SendMethod,
} from "@/lib/newyear";

const METHODS: { id: SendMethod; t: string; s: string }[] = [
  { id: "whatsapp", t: "WhatsApp", s: "Most personal" },
  { id: "email", t: "Email", s: "Send to inbox" },
  { id: "link", t: "Copy link", s: "Share anywhere" },
];

const INCLUDED: { t: string; s: string }[] = [
  {
    t: "The book Muharram",
    s: "Exploring the virtues, lessons and significance of the first month of the Islamic year.",
  },
  {
    t: "30 days of True ILM Pro",
    s: "Access premium Islamic books, audiobooks and lectures.",
  },
  {
    t: "Completely free to gift",
    s: "Send it to friends, family and loved ones in just a few taps.",
  },
];

function ctaLabel(step: number, method: SendMethod) {
  if (step === 1) return "Continue";
  if (method === "email") return "Send free gift by email";
  if (method === "link") return "Copy gift link";
  return "Send free gift via WhatsApp";
}

export default function NewYear() {
  const [step, setStep] = useState(1);
  const [pick, setPick] = useState<CardId>("lantern");
  const [to, setTo] = useState("");
  const [from, setFrom] = useState("");
  const [note, setNote] = useState(DEFAULT_NOTE);
  const [method, setMethod] = useState<SendMethod>("whatsapp");
  const [hadithId, setHadithId] = useState(DEFAULT_HADITH_ID);
  const [customHadith, setCustomHadith] = useState(false);
  const [customText, setCustomText] = useState("");
  const [customSource, setCustomSource] = useState("");
  const [sent, setSent] = useState(false);
  const [giftUrl, setGiftUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [source, setSource] = useState<"direct" | "ref" | "ref_claim">("direct");

  /* Resolve referral source once on mount and pin it for the session. */
  useEffect(() => {
    try {
      const cached = sessionStorage.getItem("tilm_source");
      if (cached === "direct" || cached === "ref" || cached === "ref_claim") {
        setSource(cached);
        return;
      }
      const isRef = new URLSearchParams(window.location.search).get("ref") === "g";
      const claimed = localStorage.getItem("tilm_claimed") === "1";
      const s: "direct" | "ref" | "ref_claim" = isRef ? (claimed ? "ref_claim" : "ref") : "direct";
      sessionStorage.setItem("tilm_source", s);
      setSource(s);
    } catch {
      /* storage unavailable, fall back to direct */
    }
  }, []);

  const customTextActive = customHadith ? customText : "";
  const customSourceActive = customHadith ? customSource : "";
  const hadith: Hadith = resolveHadith(hadithId, customTextActive, customSourceActive);

  const gift: NewYearGift = {
    card: pick,
    to,
    from,
    note,
    method,
    hadithId,
    customHadith: customTextActive,
    customSource: customSourceActive,
  };

  const previewName = to || "Fatimah";
  const previewSender = from || "Abdullah";

  const namesFilled = to.trim() !== "" && from.trim() !== "";
  const canProceed = step === 1 || namesFilled;

  function handlePrimary() {
    if (step === 1) {
      setStep(2);
      return;
    }
    if (!namesFilled) return;
    track("gift_share", { method: gift.method, card: gift.card, source });
    logEvent("gift_share", { method: gift.method, card: gift.card, source });
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const url = buildGiftUrl(gift, origin);
    setGiftUrl(url);
    const action = buildShareAction(gift, url);
    if (action.kind === "href") {
      window.open(action.href, "_blank", "noopener,noreferrer");
    } else {
      void copy(action.text);
    }
    setSent(true);
  }

  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable, link stays visible for manual copy */
    }
  }

  function reset() {
    setSent(false);
    setStep(1);
    setCopied(false);
  }

  const previewParams = new URLSearchParams({ c: pick, to, from });
  if (note && note !== DEFAULT_NOTE) previewParams.set("note", note);
  if (customTextActive) {
    previewParams.set("hq", customTextActive);
    if (customSourceActive) previewParams.set("hs", customSourceActive);
  } else if (hadithId !== DEFAULT_HADITH_ID) {
    previewParams.set("h", hadithId);
  }
  const previewHref = `/newyear/gift?${previewParams.toString()}`;

  const attachedHadith = (
    <div className="attached-hadith">
      <div className="attached-hadith-label">Hadith attached</div>
      {hadith.ar && (
        <p className="attached-hadith-ar" lang="ar" dir="rtl">
          {hadith.ar}
        </p>
      )}
      <p className="attached-hadith-en">“{hadith.en}”</p>
      {hadith.source && <p className="attached-hadith-src">{hadith.source}</p>}
    </div>
  );

  const included = (
    <div className="included">
      <div className="included-title">What&apos;s included</div>
      <div className="included-grid">
        {INCLUDED.map((it) => (
          <div className="included-item" key={it.t}>
            <div className="included-check">✓</div>
            <div>
              <div className="included-h">{it.t}</div>
              <div className="included-p">{it.s}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  /* Shared sent-confirmation block */
  const sentBlock = (
    <>
      <div className="lbl">Your gift is ready</div>
      <div className="link-row">
        <div className="url" title={giftUrl}>
          {giftUrl}
        </div>
        <button className={"copy-btn" + (copied ? " copied" : "")} onClick={() => copy(giftUrl)}>
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <div style={{ display: "flex", gap: 16, marginTop: 14, alignItems: "center" }}>
        <Link className="text-link" href={previewHref}>
          Preview what they&apos;ll see →
        </Link>
        <button className="text-link" onClick={reset}>
          Send another
        </button>
      </div>
    </>
  );

  return (
    <main>
      {/* ── DESKTOP: split-screen ─────────────────────────────────── */}
      <div className="ds desktop-only">
        <div className="ds-left">
          <div className="ds-brand">
            <Image src="/true-ilm-logo.svg" alt="True ILM" width={120} height={36} priority />
          </div>

          <div className="ds-steps">
            <span className={"num " + (step === 1 ? "active" : "inactive")}>1</span>
            <span className={"lbl " + (step === 1 ? "active" : "")}>Choose</span>
            <span className="div" />
            <span className={"num " + (step === 2 ? "active" : "inactive")}>2</span>
            <span className={"lbl " + (step === 2 ? "active" : "")}>Personalise</span>
          </div>
          <h1 className="ds-h1">
            Send the gift of <em>knowledge</em> this New Year.
          </h1>
          <p className="ds-sub">
            Gift someone the book <b>Muharram</b> and 30 days of True ILM Pro, completely free, and help them start
            the new Islamic year with beneficial knowledge.
          </p>

          {step === 1 && (
            <>
              <div className="ds-label">Pick a colour</div>
              <div className="ds-swatches">
                {CARDS.map((c) => (
                  <button
                    key={c.id}
                    className={`ds-swatch ds-swatch-${c.id} ` + (pick === c.id ? "active" : "")}
                    onClick={() => setPick(c.id)}
                    title={c.title}
                    aria-label={c.title}
                  />
                ))}
              </div>

              {included}
            </>
          )}

          {step === 2 && !sent && (
            <>
              <div className="ds-row">
                <div className="ds-field">
                  <label htmlFor="d-to">Recipient&apos;s name</label>
                  <input id="d-to" value={to} onChange={(e) => setTo(e.target.value)} placeholder="e.g. Fatimah" />
                </div>
                <div className="ds-field">
                  <label htmlFor="d-from">Your name</label>
                  <input id="d-from" value={from} onChange={(e) => setFrom(e.target.value)} placeholder="e.g. Abdullah" />
                </div>
              </div>
              <div className="ds-field" style={{ marginBottom: 22 }}>
                <label htmlFor="d-note">Add a note</label>
                <textarea id="d-note" value={note} onChange={(e) => setNote(e.target.value)} placeholder={DEFAULT_NOTE} />
              </div>

              <div className="ds-label-sm">Attach a hadith on seeking knowledge</div>
              <HadithPicker
                hadithId={hadithId}
                setHadithId={setHadithId}
                custom={customHadith}
                setCustom={setCustomHadith}
                customText={customText}
                setCustomText={setCustomText}
                customSource={customSource}
                setCustomSource={setCustomSource}
              />

              <div className="ds-label-sm" style={{ marginTop: 22 }}>
                How to send
              </div>
              <div className="ds-options">
                {METHODS.map((o) => (
                  <button
                    key={o.id}
                    className={"ds-opt " + (method === o.id ? "active" : "")}
                    onClick={() => setMethod(o.id)}
                  >
                    <div className="ttl">{o.t}</div>
                    <div className="sub">{o.s}</div>
                  </button>
                ))}
              </div>
              {!namesFilled && <p className="send-hint">Add both names to send your gift.</p>}
            </>
          )}

          {sent && <div className="ds-sent sent-panel">{sentBlock}</div>}

          {!sent && (
            <div className="ds-actions">
              {step === 2 ? (
                <button className="ds-back" onClick={() => setStep(1)}>
                  ← Back
                </button>
              ) : (
                <div />
              )}
              <button className="ds-next" onClick={handlePrimary} disabled={!canProceed}>
                {ctaLabel(step, method)} →
              </button>
            </div>
          )}
        </div>

        <div className="ds-right">
          <div className="ds-card-stage">
            <NewYearCardFrame id={pick} recipient={previewName} sender={previewSender} showOverlay />
            {attachedHadith}
            <div className="ds-card-caption">
              The book Muharram + <b>30 days Pro</b>, free
            </div>
          </div>
        </div>
      </div>

      {/* ── MOBILE: stacked 2-step ────────────────────────────────── */}
      <div className="phone mobile-only">
        <div className="appbar">
          <div className="brand">
            <Image src="/true-ilm-logo.svg" alt="True ILM" width={96} height={24} priority />
          </div>
        </div>

        <div className="hero">
          <div className="ar">عَامٌ هِجْرِيٌّ جَدِيد</div>
          <h1>
            Send the gift of <em>knowledge</em> this New Year.
          </h1>
          <p>
            The book <b>Muharram</b> and 30 days of True ILM Pro, completely free.
          </p>
        </div>

        <div className="stepbar">
          <span className={"num " + (step === 1 ? "active" : "inactive")}>1</span>
          <span className={"lbl " + (step === 1 ? "active" : "")}>Choose</span>
          <span className="divider" />
          <span className={"num " + (step === 2 ? "active" : "inactive")}>2</span>
          <span className={"lbl " + (step === 2 ? "active" : "")}>Personalise</span>
        </div>

        <div className="preview">
          <div className="frameWrap">
            <NewYearCardFrame id={pick} recipient={previewName} sender={previewSender} showOverlay />
          </div>
          {attachedHadith}
          <div className="ds-card-caption">
            The book Muharram + <b>30 days Pro</b>, free
          </div>
        </div>

        {step === 1 && !sent && (
          <>
            <div className="secLabel">Pick a colour</div>
            <div className="swatches">
              {CARDS.map((c) => (
                <button
                  key={c.id}
                  className={`swatch swatch-${c.id} ` + (pick === c.id ? "active" : "")}
                  onClick={() => setPick(c.id)}
                  title={c.title}
                  aria-label={c.title}
                />
              ))}
            </div>
            {included}
          </>
        )}

        {step === 2 && !sent && (
          <>
            <div className="form" style={{ paddingTop: 18 }}>
              <div className="field">
                <label htmlFor="m-to">Recipient&apos;s name</label>
                <input id="m-to" value={to} onChange={(e) => setTo(e.target.value)} placeholder="e.g. Fatimah" />
              </div>
              <div className="field">
                <label htmlFor="m-from">Your name</label>
                <input id="m-from" value={from} onChange={(e) => setFrom(e.target.value)} placeholder="e.g. Abdullah" />
              </div>
              <div className="field">
                <label htmlFor="m-note">Add a note</label>
                <textarea id="m-note" value={note} onChange={(e) => setNote(e.target.value)} placeholder="A short message for them" />
              </div>
            </div>

            <div className="secLabel">Attach a hadith</div>
            <div style={{ padding: "0 22px" }}>
              <HadithPicker
                hadithId={hadithId}
                setHadithId={setHadithId}
                custom={customHadith}
                setCustom={setCustomHadith}
                customText={customText}
                setCustomText={setCustomText}
                customSource={customSource}
                setCustomSource={setCustomSource}
              />
            </div>

            <div className="secLabel">How to send</div>
            <div className="form" style={{ paddingTop: 0 }}>
              <div className="method-row">
                {METHODS.map((o) => (
                  <button
                    key={o.id}
                    className={"method-opt " + (method === o.id ? "active" : "")}
                    onClick={() => setMethod(o.id)}
                  >
                    <div className="ttl">{o.t}</div>
                    <div className="sub">{o.s}</div>
                  </button>
                ))}
              </div>
              {!namesFilled && <p className="send-hint">Add both names to send your gift.</p>}
            </div>
          </>
        )}

        {sent && <div className="sent-panel">{sentBlock}</div>}

        {!sent && (
          <div className="actions">
            {step === 2 && (
              <button className="back" onClick={() => setStep(1)}>
                ← Back
              </button>
            )}
            <button className="cta" onClick={handlePrimary} disabled={!canProceed}>
              {step === 2 && method === "whatsapp" && <WhatsAppIcon />}
              {ctaLabel(step, method)}
            </button>
          </div>
        )}

        <BooksMarquee label="Unlocks the full library" />

        <div className="trust">
          <span className="stars">★★★★★</span>
          <span>160,000+ Muslims · 185 countries</span>
        </div>
      </div>
    </main>
  );
}
