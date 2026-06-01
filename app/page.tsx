"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { track } from "@vercel/analytics";
import { logEvent } from "@/lib/track";
import { CARDS, CardFrame, type CardId } from "@/components/cards";
import { BooksMarquee } from "@/components/BooksMarquee";
import { WhatsAppIcon, ArrowIcon } from "@/components/icons";
import {
  DEFAULT_NOTE,
  buildGiftUrl,
  buildShareAction,
  type Gift,
  type SendMethod,
} from "@/lib/gift";

const METHODS: { id: SendMethod; t: string; s: string }[] = [
  { id: "whatsapp", t: "WhatsApp", s: "Most personal" },
  { id: "email", t: "Email", s: "Send to inbox" },
  { id: "link", t: "Copy link", s: "Share anywhere" },
];

function ctaLabel(step: number, method: SendMethod) {
  if (step === 1) return "Continue";
  if (method === "email") return "Send by email";
  if (method === "link") return "Copy gift link";
  return "Send via WhatsApp";
}

export default function Home() {
  const [step, setStep] = useState(1);
  const [pick, setPick] = useState<CardId>("lantern");
  const [to, setTo] = useState("");
  const [from, setFrom] = useState("");
  const [note, setNote] = useState(DEFAULT_NOTE);
  const [method, setMethod] = useState<SendMethod>("whatsapp");
  const [sent, setSent] = useState(false);
  const [giftUrl, setGiftUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [source, setSource] = useState<"direct" | "ref" | "ref_claim">("direct");

  /* Resolve referral source once on mount and pin it for the session, so step
     transitions or refreshes don't lose the signal. ?ref=g marks visitors who
     came from someone else's gift page; tilm_claimed adds the claimed bit. */
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
      /* storage unavailable — fall back to direct */
    }
  }, []);

  const gift: Gift = { card: pick, to, from, note, method };

  const previewName = to || "Fatimah";
  const previewSender = from || "Abdullah";

  /* Step 2 requires both names before the gift can be sent. */
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
      /* clipboard unavailable — link stays visible for manual copy */
    }
  }

  function reset() {
    setSent(false);
    setStep(1);
    setCopied(false);
  }

  const previewHref = `/gift?${new URLSearchParams({
    c: pick,
    to,
    from,
    ...(note && note !== DEFAULT_NOTE ? { note } : {}),
  }).toString()}`;

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
            Send the gift of <em>Eid</em>.
          </h1>
          <p className="ds-sub">One month of unlimited audiobooks and eBooks, on us.</p>

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

              <BooksMarquee label="Unlocks the full library" />
            </>
          )}

          {step === 2 && !sent && (
            <>
              <div className="ds-label-sm">How to send</div>
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
              <div className="ds-field" style={{ marginBottom: 18 }}>
                <label htmlFor="d-note">Add a note</label>
                <textarea id="d-note" value={note} onChange={(e) => setNote(e.target.value)} placeholder={DEFAULT_NOTE} />
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
            <CardFrame id={pick} recipient={previewName} sender={previewSender} showOverlay />
            <div className="ds-card-caption">
              1 month of <b>True ILM Pro</b> for free
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
          <div className="ar">عيد مبارك</div>
          <h1>
            Send the gift of <em>Eid</em>.
          </h1>
          <p>One month of unlimited audiobooks and eBooks, on us.</p>
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
            <CardFrame id={pick} recipient={previewName} sender={previewSender} showOverlay />
          </div>
          <div className="ds-card-caption">
            1 month of <b>True ILM Pro</b> for free
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
          </>
        )}

        {step === 2 && !sent && (
          <>
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
              <div className="field" style={{ marginTop: 6 }}>
                <label htmlFor="m-to">Recipient&apos;s name</label>
                <input id="m-to" value={to} onChange={(e) => setTo(e.target.value)} placeholder="e.g. Fatimah" />
              </div>
              <div className="field">
                <label htmlFor="m-from">Your name</label>
                <input id="m-from" value={from} onChange={(e) => setFrom(e.target.value)} placeholder="e.g. Abdullah" />
              </div>
              <div className="field">
                <label htmlFor="m-note">Add a note</label>
                <textarea id="m-note" value={note} onChange={(e) => setNote(e.target.value)} placeholder="A short Eid message for them" />
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
