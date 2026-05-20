import { ImageResponse } from "next/og";

export const runtime = "edge";

type Theme = {
  bg: string;
  text: string;
  accent: string;
  greet: string;
  orb: string;
  orbCut: string;
  starOpacity: number;
};

const THEMES: Record<string, Theme> = {
  lantern: {
    bg: "radial-gradient(circle at 50% 38%, #22306B 0%, #141E48 55%, #0A1129 100%)",
    text: "#FEF7E6",
    accent: "#EAC060",
    greet: "#EAC060",
    orb: "#EAC060",
    orbCut: "#101A40",
    starOpacity: 0.9,
  },
  skyline: {
    bg: "linear-gradient(180deg, #FEF7E6 0%, #FAEBC8 55%, #F2D89A 100%)",
    text: "#192351",
    accent: "#C09940",
    greet: "#192351",
    orb: "#EAC060",
    orbCut: "#FBEBC4",
    starOpacity: 0,
  },
  ornament: {
    bg: "linear-gradient(180deg, #FEF7E6 0%, #F9E8E1 60%, #F2D8D0 100%)",
    text: "#192351",
    accent: "#B07069",
    greet: "#192351",
    orb: "#DC9A92",
    orbCut: "#FBEFEA",
    starOpacity: 0,
  },
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("c") || "lantern";
  const theme = THEMES[id] ?? THEMES.lantern;
  const isDark = id === "lantern";

  const [poppins, tajawal] = await Promise.all([
    fetch(new URL("./Poppins-Bold.ttf", import.meta.url)).then((r) => r.arrayBuffer()),
    fetch(new URL("./Tajawal-Bold.ttf", import.meta.url)).then((r) => r.arrayBuffer()),
  ]);

  /* A few scattered stars for the night card */
  const stars = isDark
    ? [
        [120, 90, 5],
        [320, 150, 3],
        [980, 110, 4],
        [1080, 220, 3],
        [180, 420, 3],
        [1040, 470, 4],
        [60, 250, 3],
      ]
    : [];

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: theme.bg,
          fontFamily: "Poppins",
          position: "relative",
        }}
      >
        {/* stars */}
        {stars.map(([x, y, r], i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: r * 2,
              height: r * 2,
              borderRadius: r,
              background: theme.accent,
              opacity: theme.starOpacity,
            }}
          />
        ))}

        {/* orb (crescent on the night card, soft sun otherwise), top-right */}
        <div
          style={{
            position: "absolute",
            top: 70,
            right: 96,
            width: 180,
            height: 180,
            borderRadius: 90,
            background: theme.orb,
            display: "flex",
          }}
        >
          {isDark && (
            <div
              style={{
                position: "absolute",
                top: -14,
                right: -8,
                width: 160,
                height: 160,
                borderRadius: 80,
                background: theme.orbCut,
              }}
            />
          )}
        </div>

        {/* greeting */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontFamily: "Tajawal", fontSize: 64, color: theme.greet, lineHeight: 1 }}>
            عيد مبارك
          </div>
          <div
            style={{
              fontSize: 20,
              letterSpacing: 8,
              color: theme.accent,
              marginTop: 14,
            }}
          >
            EID MUBARAK
          </div>
        </div>

        {/* headline — no personalisation */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 100,
              color: theme.text,
              lineHeight: 1.02,
              letterSpacing: -2,
            }}
          >
            Open Eid Gift
          </div>
        </div>

        {/* footer: wordmark + tagline */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: `1px solid ${isDark ? "rgba(234,192,96,0.3)" : "rgba(25,35,81,0.2)"}`,
            paddingTop: 26,
          }}
        >
          <div style={{ fontSize: 34, letterSpacing: 2, color: theme.text }}>TRUE ILM</div>
          <div style={{ fontSize: 22, color: theme.accent, letterSpacing: 1 }}>
            1 month of audiobooks &amp; eBooks · on us
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: "Poppins", data: poppins, weight: 700, style: "normal" },
        { name: "Tajawal", data: tajawal, weight: 700, style: "normal" },
      ],
    },
  );
}
