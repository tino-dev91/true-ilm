import { ImageResponse } from "next/og";
import { resolveCardId, type CardId } from "@/components/card-data";

export const runtime = "edge";

/* ── Card design, mirrored from components/cards.tsx ──────────────────────
   The OG preview renders the *actual* gift card the recipient sees: themed
   background, tone-on-tone star lattice, the gift box, the Eid Mubarak
   calligraphy and the recipient/sender overlay — centred on a branded
   backdrop. The card artwork (no text) is built as an SVG data-URI <img> so
   resvg can render the pattern/clip/gradient; text is layered on top with the
   loaded Poppins font. */

const CARD_CFG: Record<CardId, { bg: string; pat: string; patOp: number }> = {
  lantern: { bg: "#192351", pat: "#FEF7E6", patOp: 0.08 },
  skyline: { bg: "#FFE8B3", pat: "#B5811F", patOp: 0.13 },
  ornament: { bg: "#FBB1B8", pat: "#9C414A", patOp: 0.12 },
};

const OVERLAY: Record<CardId, { color: string; accent: string; greet: string; shadow: boolean }> = {
  lantern: { color: "#FEF7E6", accent: "#F5D27A", greet: "#FEF7E6", shadow: true },
  skyline: { color: "#192351", accent: "#B5742A", greet: "#192351", shadow: false },
  ornament: { color: "#192351", accent: "#B5495A", greet: "#192351", shadow: false },
};

/* 8-point Islamic star polygon points, centred at (cx, cy). */
function starPoints(cx: number, cy: number, r: number) {
  const inner = r * 0.42;
  const pts: string[] = [];
  for (let i = 0; i < 16; i++) {
    const a = (i * Math.PI) / 8 - Math.PI / 2;
    const rad = i % 2 === 0 ? r : inner;
    pts.push(`${(cx + Math.cos(a) * rad).toFixed(2)},${(cy + Math.sin(a) * rad).toFixed(2)}`);
  }
  return pts.join(" ");
}

/* Shared gift box paths (1008×704 card space). Bottom is clipped by the card's
   rounded rect, exactly like the live card. */
const GIFT_BOX = `
<path d="M306.627 633.977L328.834 797.697H678.206L700.413 633.977H306.627Z" fill="#F04A4C"/>
<path d="M304.967 621.764L306.626 633.978H469.766V621.764H304.967Z" fill="#BB3939"/>
<path d="M702.074 621.764H537.732V633.978H700.414L702.074 621.764Z" fill="#BB3939"/>
<path d="M537.73 633.977H469.766V797.697H537.73V633.977Z" fill="#ED9829"/>
<path d="M537.73 621.764H469.766V633.978H537.73V621.764Z" fill="#DD8924"/>
<path d="M593.317 524.062C562.526 564.359 519.77 564.371 519.77 564.371C519.892 564.164 520.027 563.962 520.149 563.761L512.449 566.647H595.459C616.373 565.469 631.54 547.703 643.449 532.42C647.079 527.759 649.55 523.086 650.605 518.297C620.851 517.04 602.463 521.115 593.324 524.068L593.317 524.062Z" fill="#ED9829"/>
<path d="M417.423 524.062C448.214 564.359 490.97 564.371 490.97 564.371C490.848 564.164 490.714 563.962 490.592 563.761L498.291 566.647H415.281C394.367 565.469 379.2 547.703 367.291 532.42C363.661 527.759 361.19 523.086 360.135 518.297C389.889 517.04 408.277 521.115 417.417 524.068L417.423 524.062Z" fill="#ED9829"/>
<path d="M595.457 521.175C594.749 522.163 594.036 523.115 593.316 524.061C602.455 521.108 620.843 517.039 650.598 518.289C651.934 512.213 650.982 505.953 647.205 499.309C641.324 488.962 631.953 480.848 622.832 473.423C613.577 465.894 603.23 459.708 592.217 455.108C580.613 450.258 570.248 446.42 558.827 453.631C549.328 459.623 541.421 467.822 535.234 477.163C511.172 513.506 509.879 566.639 509.879 566.639H512.447L520.147 563.754C544.398 524.329 595.457 521.175 595.457 521.175Z" fill="#FBB12F"/>
<path d="M415.279 521.175C415.987 522.163 416.701 523.115 417.421 524.061C408.282 521.108 389.893 517.039 360.139 518.289C358.803 512.213 359.755 505.953 363.531 499.309C369.412 488.962 378.783 480.848 387.904 473.423C397.16 465.894 407.507 459.708 418.519 455.108C430.123 450.258 440.489 446.42 451.91 453.631C461.409 459.623 469.316 467.822 475.502 477.163C499.564 513.506 500.858 566.639 500.858 566.639H498.289L490.59 563.754C466.338 524.329 415.279 521.175 415.279 521.175Z" fill="#FBB12F"/>
<path d="M706.412 562.663H301.089C296.203 562.663 292.242 566.624 292.242 571.509V612.916C292.242 617.802 296.203 621.763 301.089 621.763H706.412C711.298 621.763 715.258 617.802 715.258 612.916V571.509C715.258 566.624 711.298 562.663 706.412 562.663Z" fill="#F04A4C"/>
<path d="M545.911 562.663H461.352V621.763H545.911V562.663Z" fill="#FBB12F"/>`;

/* The full card artwork (background + star lattice + gift box + beveled rim),
   1008×704 with rounded corners, as an inline-SVG data URI. */
function cardArtwork(id: CardId) {
  const { bg, pat, patOp } = CARD_CFG[id];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1008" height="704" viewBox="0 0 1008 704" fill="none">
<defs>
<clipPath id="cc"><rect width="1007.88" height="703.44" rx="50"/></clipPath>
<pattern id="cp" width="86" height="86" patternUnits="userSpaceOnUse" patternTransform="rotate(8)">
<g fill="${pat}">
<polygon points="${starPoints(43, 43, 11)}"/>
<circle cx="0" cy="0" r="2.4"/><circle cx="86" cy="0" r="2.4"/><circle cx="0" cy="86" r="2.4"/><circle cx="86" cy="86" r="2.4"/>
</g>
</pattern>
<linearGradient id="cb" x1="0" y1="0" x2="0" y2="704" gradientUnits="userSpaceOnUse">
<stop offset="0" stop-color="#FFFFFF" stop-opacity="0.4"/>
<stop offset="0.45" stop-color="#FFFFFF" stop-opacity="0.06"/>
<stop offset="1" stop-color="#000000" stop-opacity="0.22"/>
</linearGradient>
</defs>
<g clip-path="url(#cc)">
<rect width="1007.88" height="703.44" rx="50" fill="${bg}"/>
<rect width="1007.88" height="703.44" fill="url(#cp)" opacity="${patOp}"/>
${GIFT_BOX}
<rect x="1.5" y="1.5" width="1004.88" height="700.44" rx="48.5" fill="none" stroke="url(#cb)" stroke-width="3"/>
</g>
</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

/* Eid Mubarak calligraphy, recoloured to the card's greeting colour. */
async function greetingArtwork(origin: string, color: string) {
  try {
    const raw = await fetch(`${origin}/eid-greeting.svg`).then((r) => (r.ok ? r.text() : ""));
    if (!raw) return null;
    const recoloured = raw.replace(/fill="white"/gi, `fill="${color}"`).replace(/fill="#fff(?:fff)?"/gi, `fill="${color}"`);
    return `data:image/svg+xml;utf8,${encodeURIComponent(recoloured)}`;
  } catch {
    return null;
  }
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const id = resolveCardId(url.searchParams.get("c"));
  const to = (url.searchParams.get("to") || "").trim();
  const from = (url.searchParams.get("from") || "").trim();

  const ov = OVERLAY[id];
  const [poppins, greeting] = await Promise.all([
    fetch(new URL("./Poppins-Bold.ttf", import.meta.url)).then((r) => r.arrayBuffer()),
    greetingArtwork(url.origin, ov.greet),
  ]);

  /* Card geometry on the 1200×630 canvas (keeps the 1008×704 ratio). */
  const CARD_W = 730;
  const CARD_H = 510;

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(160deg, #0d1430 0%, #192351 60%, #20305f 100%)",
          fontFamily: "Poppins",
          position: "relative",
        }}
      >
        {/* faint backdrop stars */}
        {[
          [120, 90, 4],
          [1040, 120, 5],
          [200, 520, 3],
          [1010, 520, 4],
          [80, 320, 3],
          [1130, 330, 3],
        ].map(([x, y, r], i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: r * 2,
              height: r * 2,
              borderRadius: r,
              background: "#F5D27A",
              opacity: 0.5,
            }}
          />
        ))}

        {/* The gift card */}
        <div
          style={{
            position: "relative",
            display: "flex",
            width: CARD_W,
            height: CARD_H,
            borderRadius: 36,
            boxShadow: "0 30px 70px rgba(0,0,0,0.45)",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={cardArtwork(id)} width={CARD_W} height={CARD_H} alt="" style={{ position: "absolute", top: 0, left: 0 }} />

          {/* text overlay — greeting, recipient, sender (mirrors the card) */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: CARD_W,
              height: CARD_H,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              paddingTop: 38,
            }}
          >
            {greeting ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={greeting} width={120} height={123} alt="Eid Mubarak" />
            ) : null}

            {to ? (
              <div style={{ display: "flex", width: "100%", justifyContent: "center", marginTop: 30 }}>
                <div
                  style={{
                    fontSize: 60,
                    fontWeight: 700,
                    lineHeight: 1.04,
                    letterSpacing: -1,
                    color: ov.color,
                    textShadow: ov.shadow ? "0 1px 2px rgba(0,0,0,0.18)" : "none",
                    maxWidth: CARD_W - 120,
                    textAlign: "center",
                  }}
                >
                  {to}
                </div>
              </div>
            ) : null}

            {to && from ? (
              <div style={{ display: "flex", width: "100%", justifyContent: "center", marginTop: 12 }}>
                <div
                  style={{
                    fontSize: 20,
                    fontWeight: 700,
                    letterSpacing: 2,
                    textTransform: "uppercase",
                    color: ov.accent,
                  }}
                >
                  {`A gift from ${from}`}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [{ name: "Poppins", data: poppins, weight: 700, style: "normal" }],
    },
  );
}
