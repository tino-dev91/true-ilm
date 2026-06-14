/* Server-safe hadith data (no React) for the New Year "gift of knowledge"
   flow. A shortlist of the five shortest hadith on seeking knowledge, plus
   support for a sender's own custom quote. */

export interface Hadith {
  id: string;
  ar: string;
  en: string;
  source: string;
  /** true when supplied by the sender rather than from the shortlist */
  custom?: boolean;
}

/* The five shortest hadith on seeking knowledge (from Forty Hadith on
   Knowledge, Abu Amina Elias). Short enough to read at a glance on a card. */
export const HADITHS: Hadith[] = [
  {
    id: "obligation",
    ar: "طَلَبُ الْعِلْمِ فَرِيضَةٌ عَلَى كُلِّ مُسْلِمٍ",
    en: "Seeking knowledge is an obligation upon every Muslim.",
    source: "Sunan Ibn Mājah 224",
  },
  {
    id: "quran",
    ar: "خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ",
    en: "The best of you are those who learn the Qur'an and teach it.",
    source: "Ṣaḥīḥ al-Bukhārī 5027",
  },
  {
    id: "understanding",
    ar: "مَنْ يُرِدِ اللَّهُ بِهِ خَيْرًا يُفَقِّهْهُ فِي الدِّينِ",
    en: "If Allah intends goodness for someone, He gives him understanding of the religion.",
    source: "Ṣaḥīḥ al-Bukhārī 71",
  },
  {
    id: "cure",
    ar: "إِنَّمَا شِفَاءُ الْعِيِّ السُّؤَالُ",
    en: "Verily, the cure for ignorance is to ask questions.",
    source: "Sunan Abī Dāwūd 336",
  },
  {
    id: "path",
    ar: "مَنْ خَرَجَ فِي طَلَبِ الْعِلْمِ كَانَ فِي سَبِيلِ اللَّهِ حَتَّى يَرْجِعَ",
    en: "Whoever goes out seeking knowledge is in the path of Allah until he returns.",
    source: "Sunan al-Tirmidhī 2647",
  },
];

export const DEFAULT_HADITH_ID = "obligation";

const BY_ID: Record<string, Hadith> = Object.fromEntries(HADITHS.map((h) => [h.id, h]));

/** Returns the chosen hadith for the gift: a sender's custom quote if supplied,
    otherwise the preset matching `id`, defaulting to the obligation hadith. */
export function resolveHadith(
  id: string | null | undefined,
  customText?: string | null,
  customSource?: string | null,
): Hadith {
  const text = (customText ?? "").trim();
  if (text) {
    return {
      id: "custom",
      ar: "",
      en: text,
      source: (customSource ?? "").trim(),
      custom: true,
    };
  }
  return BY_ID[(id ?? "") as string] ?? BY_ID[DEFAULT_HADITH_ID];
}
