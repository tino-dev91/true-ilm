import { ImageResponse } from "next/og";

export const runtime = "edge";

type Theme = { bg: string; text: string; accent: string };

const THEMES: Record<string, Theme> = {
  lantern: { bg: "#192351", text: "#FEF7E6", accent: "#F5D27A" },
  skyline: { bg: "#FFE8B3", text: "#192351", accent: "#B5742A" },
  ornament: { bg: "#FBB1B8", text: "#192351", accent: "#B5495A" },
};

/* Gift box, scaled/positioned for the OG canvas (bottom-right). */
function GiftBox() {
  return (
    <svg
      width="540"
      height="430"
      viewBox="280 440 460 360"
      style={{ position: "absolute", right: 30, bottom: -36 }}
    >
      <path d="M306.627 633.977L328.834 797.697H678.206L700.413 633.977H306.627Z" fill="#F04A4C" />
      <path d="M304.967 621.764L306.626 633.978H469.766V621.764H304.967Z" fill="#BB3939" />
      <path d="M702.074 621.764H537.732V633.978H700.414L702.074 621.764Z" fill="#BB3939" />
      <path d="M537.73 633.977H469.766V797.697H537.73V633.977Z" fill="#ED9829" />
      <path d="M537.73 621.764H469.766V633.978H537.73V621.764Z" fill="#DD8924" />
      <path d="M593.317 524.062C562.526 564.359 519.77 564.371 519.77 564.371C519.892 564.164 520.027 563.962 520.149 563.761L512.449 566.647H595.459C616.373 565.469 631.54 547.703 643.449 532.42C647.079 527.759 649.55 523.086 650.605 518.297C620.851 517.04 602.463 521.115 593.324 524.068L593.317 524.062Z" fill="#ED9829" />
      <path d="M417.423 524.062C448.214 564.359 490.97 564.371 490.97 564.371C490.848 564.164 490.714 563.962 490.592 563.761L498.291 566.647H415.281C394.367 565.469 379.2 547.703 367.291 532.42C363.661 527.759 361.19 523.086 360.135 518.297C389.889 517.04 408.277 521.115 417.417 524.068L417.423 524.062Z" fill="#ED9829" />
      <path d="M595.457 521.175C594.749 522.163 594.036 523.115 593.316 524.061C602.455 521.108 620.843 517.039 650.598 518.289C651.934 512.213 650.982 505.953 647.205 499.309C641.324 488.962 631.953 480.848 622.832 473.423C613.577 465.894 603.23 459.708 592.217 455.108C580.613 450.258 570.248 446.42 558.827 453.631C549.328 459.623 541.421 467.822 535.234 477.163C511.172 513.506 509.879 566.639 509.879 566.639H512.447L520.147 563.754C544.398 524.329 595.457 521.175 595.457 521.175Z" fill="#FBB12F" />
      <path d="M415.279 521.175C415.987 522.163 416.701 523.115 417.421 524.061C408.282 521.108 389.893 517.039 360.139 518.289C358.803 512.213 359.755 505.953 363.531 499.309C369.412 488.962 378.783 480.848 387.904 473.423C397.16 465.894 407.507 459.708 418.519 455.108C430.123 450.258 440.489 446.42 451.91 453.631C461.409 459.623 469.316 467.822 475.502 477.163C499.564 513.506 500.858 566.639 500.858 566.639H498.289L490.59 563.754C466.338 524.329 415.279 521.175 415.279 521.175Z" fill="#FBB12F" />
      <path d="M706.412 562.663H301.089C296.203 562.663 292.242 566.624 292.242 571.509V612.916C292.242 617.802 296.203 621.763 301.089 621.763H706.412C711.298 621.763 715.258 617.802 715.258 612.916V571.509C715.258 566.624 711.298 562.663 706.412 562.663Z" fill="#F04A4C" />
      <path d="M545.911 562.663H461.352V621.763H545.911V562.663Z" fill="#FBB12F" />
    </svg>
  );
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("c") || "lantern";
  const theme = THEMES[id] ?? THEMES.lantern;
  const isDark = id === "lantern";
  const to = (searchParams.get("to") || "").trim();
  const from = (searchParams.get("from") || "").trim();
  /* Generic headline mode (e.g. the bare /newyear thumbnail). */
  const title = (searchParams.get("title") || "").trim();

  const poppins = await fetch(new URL("../../../gift/og/Poppins-Bold.ttf", import.meta.url)).then((r) =>
    r.arrayBuffer(),
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "60px 72px",
          background: theme.bg,
          fontFamily: "Poppins",
          position: "relative",
        }}
      >
        <GiftBox />

        {/* kicker */}
        <div style={{ display: "flex", fontSize: 26, letterSpacing: 8, color: theme.accent }}>
          NEW ISLAMIC YEAR 1448
        </div>

        {/* headline: generic (title) or personalised. No fragments: Satori
            only stacks *direct* element children of a flex column. */}
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 800 }}>
          {title ? (
            <div style={{ display: "flex", fontSize: 60, color: theme.text, lineHeight: 1.08, letterSpacing: -1 }}>
              {title}
            </div>
          ) : null}
          {!title && to ? (
            <div style={{ display: "flex", fontSize: 88, color: theme.text, lineHeight: 1.02, letterSpacing: -2 }}>
              {`${to},`}
            </div>
          ) : null}
          {!title ? (
            <div
              style={{ display: "flex", fontSize: 50, color: theme.text, lineHeight: 1.1, letterSpacing: -1, marginTop: to ? 6 : 0 }}
            >
              a gift of knowledge.
            </div>
          ) : null}
          {!title ? (
            <div style={{ display: "flex", fontSize: 50, color: theme.accent, lineHeight: 1.1, letterSpacing: -1, marginTop: 2 }}>
              Open up!
            </div>
          ) : null}
        </div>

        {/* footer: personal, unbranded */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            borderTop: `1px solid ${isDark ? "rgba(245,210,122,0.35)" : "rgba(25,35,81,0.2)"}`,
            paddingTop: 24,
            fontSize: 28,
            letterSpacing: 1,
            color: theme.accent,
          }}
        >
          {from ? `From ${from}` : "The book Muharram + 30 days Pro, free"}
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
