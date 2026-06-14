"use client";

import { HADITHS } from "@/lib/hadith";

/* Lets the sender attach a hadith on seeking knowledge to their gift: pick one
   of the five shortlisted narrations, or write their own quote. */
export function HadithPicker({
  hadithId,
  setHadithId,
  custom,
  setCustom,
  customText,
  setCustomText,
  customSource,
  setCustomSource,
}: {
  hadithId: string;
  setHadithId: (id: string) => void;
  custom: boolean;
  setCustom: (b: boolean) => void;
  customText: string;
  setCustomText: (s: string) => void;
  customSource: string;
  setCustomSource: (s: string) => void;
}) {
  return (
    <div className="hadith-pick">
      {HADITHS.map((h) => {
        const active = !custom && hadithId === h.id;
        return (
          <button
            key={h.id}
            type="button"
            className={"hadith-opt " + (active ? "active" : "")}
            onClick={() => {
              setCustom(false);
              setHadithId(h.id);
            }}
          >
            <span className="hadith-opt-ar" lang="ar" dir="rtl">
              {h.ar}
            </span>
            <span className="hadith-opt-en">“{h.en}”</span>
            <span className="hadith-opt-src">{h.source}</span>
          </button>
        );
      })}

      <button
        type="button"
        className={"hadith-opt hadith-opt-own " + (custom ? "active" : "")}
        onClick={() => setCustom(true)}
      >
        <span className="hadith-opt-en">✎ Write your own quote</span>
        <span className="hadith-opt-src">Add a hadith, verse or message of your choice</span>
      </button>

      {custom && (
        <div className="hadith-custom">
          <textarea
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            placeholder="Type the hadith or quote you'd like to attach…"
            rows={3}
          />
          <input
            value={customSource}
            onChange={(e) => setCustomSource(e.target.value)}
            placeholder="Source (optional), e.g. Sahih al-Bukhari"
          />
        </div>
      )}
    </div>
  );
}
