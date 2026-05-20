"use client";

/* True ILM — Eid Gift Cards (3 variants)
   Landscape 1200×600 SVG. Center zone left clear for overlaid recipient + sender name.
   Brand palette only. Lantern mark from logo kept in original gold + navy.

   Each card's SVG <defs> ids are namespaced with a per-instance `uid` (see CardFrame)
   so the same card can be rendered multiple times on one page (e.g. desktop + mobile
   layouts) without duplicate-id collisions that blank out url(#...) references. */

import React, { useId } from "react";
import { CARD_TITLES, type CardId } from "./card-data";

export type { CardId } from "./card-data";

export const B = {
  navy: "#192351",
  navyDeep: "#0A1129",
  navyMid: "#26326D",
  gold: "#EAC060",
  goldLt: "#F5D783",
  goldDp: "#C09940",
  cream: "#FEF7E6",
  creamDp: "#F5E9C8",
  white: "#FFFFFF",
} as const;

export const CARD_W = 1200;
export const CARD_H = 600;

/* ── shared decorative bits ─────────────────────────────────────────────── */

const Sparkle = ({
  x,
  y,
  size = 8,
  color = B.gold,
  opacity = 1,
  rotate = 0,
}: {
  x: number;
  y: number;
  size?: number;
  color?: string;
  opacity?: number;
  rotate?: number;
}) => (
  <g transform={`translate(${x} ${y}) rotate(${rotate})`} opacity={opacity}>
    <path
      d={`M0 -${size} L${size * 0.25} -${size * 0.25} L${size} 0 L${size * 0.25} ${size * 0.25} L0 ${size} L-${size * 0.25} ${size * 0.25} L-${size} 0 L-${size * 0.25} -${size * 0.25} Z`}
      fill={color}
    />
  </g>
);

/* Bursts of 3 little spark lines — direct reference style */
const Spark3 = ({
  x,
  y,
  size = 18,
  color = B.gold,
  rotate = 0,
}: {
  x: number;
  y: number;
  size?: number;
  color?: string;
  rotate?: number;
}) => (
  <g
    transform={`translate(${x} ${y}) rotate(${rotate})`}
    stroke={color}
    strokeWidth="3"
    strokeLinecap="round"
    fill="none"
  >
    <line x1="0" y1="-2" x2="0" y2={-size} />
    <line x1={size * 0.55} y1={size * 0.05} x2={size * 1.05} y2={-size * 0.55} />
    <line x1={-size * 0.55} y1={size * 0.05} x2={-size * 1.05} y2={-size * 0.55} />
  </g>
);

/* 8-point Islamic star (centered at 0,0) */
const EightStar = ({
  x,
  y,
  r = 20,
  color = B.gold,
  opacity = 1,
  rotate = 0,
  strokeOnly = false,
}: {
  x: number;
  y: number;
  r?: number;
  color?: string;
  opacity?: number;
  rotate?: number;
  strokeOnly?: boolean;
}) => {
  const inner = r * 0.42;
  const pts: string[] = [];
  for (let i = 0; i < 16; i++) {
    const ang = (i * Math.PI) / 8 - Math.PI / 2;
    const rad = i % 2 === 0 ? r : inner;
    pts.push(`${Math.cos(ang) * rad},${Math.sin(ang) * rad}`);
  }
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate})`} opacity={opacity}>
      {strokeOnly ? (
        <polygon points={pts.join(" ")} fill="none" stroke={color} strokeWidth="1.5" />
      ) : (
        <polygon points={pts.join(" ")} fill={color} />
      )}
    </g>
  );
};

/* ── True ILM logo — inlined paths from the brand SVG. COLOURS NEVER ALTERED.
   Spark = gold (#EAC060), lantern + wordmark = navy (#192351). */

const LANTERN_SPARK_D =
  "M32.0836 60.2209C28.4101 61.3542 26.0262 63.7576 24.8929 67.4116C24.6975 68.076 23.7594 68.076 23.564 67.4116C22.4307 63.7381 20.0273 61.3542 16.3733 60.2209C15.7089 60.0255 15.7089 59.0875 16.3733 58.8921C20.0468 57.7588 22.4307 55.3554 23.564 51.7014C23.7594 51.037 24.6975 51.037 24.8929 51.7014C26.0262 55.3749 28.4296 57.7588 32.0836 58.8921C32.748 59.0875 32.748 60.0255 32.0836 60.2209Z";
const LANTERN_BODY_D =
  "M43.555 78.2777L43.4377 78.1604V33.6676L48.4204 28.6849V25.1482C48.4204 24.2298 47.6779 23.5068 46.779 23.5068H41.4837L28.1769 9.34017L29.1539 8.34367C29.6034 7.89424 29.6815 7.21031 29.3688 6.66319L26.1447 1.1138C25.7343 0.410357 25.0114 0 24.2102 0C23.4091 0 22.6861 0.410357 22.2758 1.1138L19.0516 6.66319C18.739 7.21031 18.8172 7.89424 19.2666 8.34367L20.2436 9.34017L6.93683 23.5068H1.64142C0.742577 23.5068 0 24.2493 0 25.1482V28.6849L4.98282 33.6676V78.1604L4.86559 78.2777C3.12652 80.0363 0 83.1823 0 83.1823V86.8754C0 87.6765 0.664364 88.3409 1.46551 88.3409H13.7368L20.8689 95.942C21.7287 96.8603 22.9401 97.388 24.2102 97.388C24.8355 97.388 25.4608 97.2512 26.0274 97.0167C26.5941 96.7627 27.1217 96.4109 27.5516 95.942L34.6837 88.3409H46.9549C47.7561 88.3409 48.4204 87.6765 48.4204 86.8754V83.1823C48.4204 83.1823 45.2941 80.0363 43.555 78.2777ZM24.0539 2.01263L22.7643 6.66319L23.6632 9.88729L21.0447 7.26892L24.0344 2.01263H24.0539ZM22.3539 11.4115H22.3734L18.6022 20.1264L24.4838 23.4481H10.9815L22.3539 11.4115ZM2.65755 26.8872H24.4838L14.3816 28.763L15.7689 30.5803H6.35054L2.65755 26.8872ZM11.5678 41.8159L7.73793 37.5561V33.8239H19.2666L11.0793 36.4619L11.5678 41.8354V41.8159ZM11.7827 47.4629V77.8674H7.75749V40.8779L10.1609 43.3986C11.216 44.4929 11.7827 45.9388 11.7827 47.4629ZM2.67699 85.1754L6.37009 81.4823H15.7884L14.4011 83.2995L24.5034 85.1558H2.67699V85.1754ZM24.0734 94.1443L18.1528 88.3604L24.0344 91.4673L28.001 90.0017L24.0734 94.1443ZM33.9607 77.8674H14.5184V47.4629C14.5184 45.9584 15.1045 44.4929 16.1402 43.3986L24.2298 34.9182L32.3194 43.3986C33.355 44.4929 33.9412 45.9388 33.9412 47.4629V77.8674H33.9607ZM40.7412 77.8674H36.7159V47.4629C36.7159 45.9584 37.3021 44.4929 38.3377 43.3986L40.7412 40.8779V77.8674Z";

/* The full True ILM lockup (lantern + "TRUE ILM" wordmark), native viewBox 0 0 328 98 */
const TrueILMLogoPaths = () => (
  <g>
    <path d={LANTERN_SPARK_D} fill="#EAC060" />
    <path d={LANTERN_BODY_D} fill="#192351" />
    <path
      d="M81.736 39.7988V76.3193H74.6234V39.7988H73.2361L61.1212 41.0103L60.9453 40.7172L62.274 35.5L67.1005 36.1253H90.8808L95.4141 35.5L95.5313 35.7931L94.2613 40.9712L82.6545 39.8183H81.736V39.7988Z"
      fill="#192351"
    />
    <path
      d="M116.893 60.4955L109.136 60.0265V76.3425H102.062V36.1484H117.734C125.667 36.1484 130.024 39.9979 130.024 46.1335C130.024 51.3507 126.8 55.1024 122.853 57.9552L134.343 76.0494V76.3425H126.194L116.893 60.4955ZM109.136 40.33V56.5288L119.023 56.0208C120.977 54.0081 122.755 51.1357 122.755 47.3449C122.755 42.3427 119.824 39.9392 114.314 39.9392C112.653 39.9392 110.641 40.1151 109.136 40.3496V40.33Z"
      fill="#192351"
    />
    <path
      d="M167.712 44.4139L166.285 36.7151V36.1484H173.398L172.772 46.4852V62.2736C172.772 67.2173 171.444 70.6563 169.04 73.0793C166.461 75.7172 162.26 77.2218 156.691 77.2218C151.747 77.2218 146.979 76.0689 143.99 73.0793C141.684 70.7149 140.492 67.3345 140.492 62.6839V36.1484H147.722V62.5667C147.722 66.3575 148.406 68.9368 150.086 70.5586C151.689 72.1023 154.229 72.8643 157.961 72.8643C162.162 72.8643 165.132 71.8873 166.695 70.9103C167.203 69.4839 167.731 66.4942 167.731 63.5046V44.4335L167.712 44.4139Z"
      fill="#192351"
    />
    <path
      d="M183.109 36.1254H203.275L207.749 35.2656L207.808 35.5587L206.538 40.4437L190.163 39.9748V54.2195L206.069 53.9264V54.1609L205.033 58.3034L190.163 57.7954V72.6067L208.433 71.9815V72.2746L207.339 76.3585H183.109V36.1645V36.1254Z"
      fill="#192351"
    />
    <path d="M233.992 36.125H241.066V76.319H233.992V36.125Z" fill="#192351" />
    <path
      d="M252.359 36.125H259.433V72.5869L276.316 71.9616V72.2546L275.221 76.3385H252.359V36.1645V36.125Z"
      fill="#192351"
    />
    <path
      d="M288.605 76.3427H282.117L287.334 40.5061L285.615 36.5395V36.2464L292.962 35.6797L305.429 65.2048L315.883 39.5877L315.472 36.7153V36.4222L322.546 35.7969L327.997 76.3427H320.768L316.86 47.2865L304.921 76.3427H302.849L290.324 47.5014L288.077 71.7312L288.585 76.03V76.3231L288.605 76.3427Z"
      fill="#192351"
    />
  </g>
);

/* Embeds the full lockup at any width, preserving 328×98 aspect ratio */
const TrueILMLockup = ({ x = 0, y = 0, width = 110 }: { x?: number; y?: number; width?: number }) => (
  <svg x={x} y={y} width={width} height={(width * 98) / 328} viewBox="0 0 328 98">
    <TrueILMLogoPaths />
  </svg>
);

/* When the lockup sits on a DARK background, place it on a small cream plate so
   the navy paths stay visible without altering colour. */
const LogoPlate = ({ x, y, height = 36 }: { x: number; y: number; height?: number }) => {
  const lockupH = height - 12;
  const lockupW = (lockupH * 328) / 98;
  const padX = 12;
  const w = lockupW + padX * 2;
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x="0" y="0" width={w} height={height} rx={height / 2} fill="#FEF7E6" opacity="0.96" />
      <TrueILMLockup x={padX} y={(height - lockupH) / 2} width={lockupW} />
    </g>
  );
};

const cardSvgStyle: React.CSSProperties = { display: "block", width: "100%", height: "auto" };

/* ─────────────────────────────────────────────────────────────────────── */
/* CARD 1 — Lantern Night                                                   */
/* ─────────────────────────────────────────────────────────────────────── */
function CardLanternNight({ uid }: { uid: string }) {
  const u = (s: string) => uid + s;
  return (
    <svg viewBox={`0 0 ${CARD_W} ${CARD_H}`} xmlns="http://www.w3.org/2000/svg" style={cardSvgStyle}>
      <defs>
        <radialGradient id={u("bg")} cx="50%" cy="55%" r="75%">
          <stop offset="0%" stopColor="#22306B" />
          <stop offset="55%" stopColor="#141E48" />
          <stop offset="100%" stopColor="#0A1129" />
        </radialGradient>
        <radialGradient id={u("halo")} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={B.goldLt} stopOpacity="0.55" />
          <stop offset="40%" stopColor={B.gold} stopOpacity="0.22" />
          <stop offset="100%" stopColor={B.gold} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={u("fill")} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={B.goldLt} />
          <stop offset="60%" stopColor={B.gold} />
          <stop offset="100%" stopColor={B.goldDp} />
        </linearGradient>
        <radialGradient id={u("core")} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFF1C2" />
          <stop offset="60%" stopColor={B.goldLt} />
          <stop offset="100%" stopColor={B.gold} />
        </radialGradient>
        <radialGradient id={u("moon")} cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor={B.goldLt} />
          <stop offset="80%" stopColor={B.gold} />
          <stop offset="100%" stopColor={B.goldDp} />
        </radialGradient>
        <filter id={u("grain")} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves="2" seed="5" />
          <feColorMatrix values="0 0 0 0 0.92  0 0 0 0 0.75  0 0 0 0 0.38  0 0 0 0.06 0" />
        </filter>
        <filter id={u("grainDark")} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="1.4" numOctaves="2" seed="9" />
          <feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.30 0" />
        </filter>
      </defs>

      <rect width={CARD_W} height={CARD_H} fill={`url(#${u("bg")})`} />
      <rect width={CARD_W} height={CARD_H} filter={`url(#${u("grainDark")})`} />
      <rect width={CARD_W} height={CARD_H} filter={`url(#${u("grain")})`} style={{ mixBlendMode: "screen" }} />

      <ellipse cx={CARD_W / 2} cy={CARD_H / 2 + 20} rx="320" ry="120" fill={B.gold} opacity="0.05" />

      {(
        [
          [180, 70, 4, 0.9],
          [330, 130, 2.5, 0.7],
          [520, 80, 3, 0.85],
          [780, 110, 2, 0.6],
          [960, 60, 3.5, 0.9],
          [1100, 130, 2, 0.7],
          [90, 230, 2.5, 0.7],
          [1140, 280, 3, 0.85],
          [1080, 460, 2, 0.6],
          [200, 520, 2.5, 0.7],
          [560, 540, 3, 0.85],
          [880, 510, 2, 0.7],
          [1010, 410, 4, 0.9],
        ] as const
      ).map(([x, y, s, o], i) => (
        <circle key={i} cx={x} cy={y} r={s} fill={B.goldLt} opacity={o} />
      ))}

      <Spark3 x={1010} y={210} size={20} color={B.gold} rotate={-15} />
      <Spark3 x={160} y={130} size={14} color={B.gold} rotate={20} />
      <Spark3 x={1080} y={500} size={12} color={B.gold} rotate={-30} />

      {/* Crescent moon, top-right */}
      <g transform={`translate(${CARD_W - 200} 200)`}>
        <circle cx="0" cy="0" r="80" fill={B.gold} opacity="0.08" />
        <circle cx="0" cy="0" r="58" fill={`url(#${u("moon")})`} />
        <circle cx="22" cy="-10" r="50" fill={`url(#${u("bg")})`} />
        <ellipse cx="-10" cy="-12" rx="8" ry="6" fill={B.goldDp} opacity="0.3" />
        <ellipse cx="-22" cy="10" rx="5" ry="4" fill={B.goldDp} opacity="0.25" />
        <ellipse cx="-3" cy="22" rx="6" ry="5" fill={B.goldDp} opacity="0.25" />
      </g>

      {/* Large hanging lantern on the LEFT */}
      <g transform={`translate(190 320)`}>
        <circle cx="0" cy="0" r="230" fill={`url(#${u("halo")})`} />
        <line x1="0" y1="-200" x2="0" y2="-130" stroke={B.gold} strokeWidth="1.5" opacity="0.6" />
        <circle cx="0" cy="-205" r="3" fill={B.gold} opacity="0.7" />
        <g>
          <rect x="-7" y="-135" width="14" height="10" rx="3" fill={`url(#${u("fill")})`} />
          <path d="M-22 -125 Q0 -140 22 -125 L22 -118 Q0 -130 -22 -118 Z" fill={`url(#${u("fill")})`} />
          <rect x="-25" y="-118" width="50" height="9" rx="3" fill={`url(#${u("fill")})`} />
          <circle cx="0" cy="-145" r="3" fill={B.goldLt} />
        </g>
        <path
          d="M-25 -109 L-30 -10 Q-30 8 -15 8 L15 8 Q30 8 30 -10 L25 -109 Z"
          fill={B.navyMid}
          stroke={B.gold}
          strokeWidth="2.5"
        />
        <ellipse cx="0" cy="-50" rx="18" ry="32" fill={`url(#${u("core")})`} opacity="0.85" />
        <ellipse cx="0" cy="-50" rx="9" ry="20" fill="#FFF8DC" opacity="0.9" />
        <line x1="-28" y1="-80" x2="28" y2="-80" stroke={B.gold} strokeWidth="1.5" opacity="0.7" />
        <line x1="-29" y1="-25" x2="29" y2="-25" stroke={B.gold} strokeWidth="1.5" opacity="0.7" />
        <line x1="-13" y1="-109" x2="-15" y2="8" stroke={B.gold} strokeWidth="1" opacity="0.55" />
        <line x1="13" y1="-109" x2="15" y2="8" stroke={B.gold} strokeWidth="1" opacity="0.55" />
        <rect x="-30" y="8" width="60" height="10" rx="3" fill={`url(#${u("fill")})`} />
        <path d="M-22 18 L-18 30 L18 30 L22 18 Z" fill={B.goldDp} />
        <circle cx="0" cy="36" r="3" fill={B.gold} />
      </g>

      <text
        x={CARD_W / 2}
        y="78"
        textAnchor="middle"
        fill={B.gold}
        fontFamily="var(--font-arabic)"
        fontSize="48"
        letterSpacing="6"
        style={{ filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.4))" }}
      >
        عيد مبارك
      </text>
      <text
        x={CARD_W / 2}
        y="108"
        textAnchor="middle"
        fill={B.gold}
        opacity="0.55"
        fontFamily="var(--font-body)"
        fontSize="11"
        fontWeight="700"
        letterSpacing="6"
      >
        EID MUBARAK
      </text>

      <g transform={`translate(${CARD_W / 2} ${CARD_H - 56})`}>
        <line x1="-220" y1="0" x2="-26" y2="0" stroke={B.gold} strokeWidth="1" opacity="0.4" />
        <Sparkle x={0} y={0} size={9} color={B.gold} opacity={0.85} />
        <circle cx="-16" cy="0" r="2" fill={B.gold} opacity="0.5" />
        <circle cx="16" cy="0" r="2" fill={B.gold} opacity="0.5" />
        <line x1="26" y1="0" x2="220" y2="0" stroke={B.gold} strokeWidth="1" opacity="0.4" />
      </g>

      <LogoPlate x={50} y={524} height={40} />
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────────────── */
/* CARD 2 — Heritage Skyline                                                */
/* ─────────────────────────────────────────────────────────────────────── */
function CardHeritageSkyline({ uid }: { uid: string }) {
  const u = (s: string) => uid + s;
  return (
    <svg viewBox={`0 0 ${CARD_W} ${CARD_H}`} xmlns="http://www.w3.org/2000/svg" style={cardSvgStyle}>
      <defs>
        <linearGradient id={u("sky")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FEF7E6" />
          <stop offset="55%" stopColor="#FAEBC8" />
          <stop offset="100%" stopColor="#F2D89A" />
        </linearGradient>
        <radialGradient id={u("sun")} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFF1C2" />
          <stop offset="55%" stopColor={B.goldLt} />
          <stop offset="100%" stopColor={B.gold} />
        </radialGradient>
        <radialGradient id={u("sunhalo")} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={B.gold} stopOpacity="0.35" />
          <stop offset="100%" stopColor={B.gold} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={u("skyline")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1F2A5F" />
          <stop offset="100%" stopColor="#0A1129" />
        </linearGradient>
        <filter id={u("grainWarm")} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="1.5" numOctaves="2" seed="11" />
          <feColorMatrix values="0 0 0 0 0.55  0 0 0 0 0.40  0 0 0 0 0.18  0 0 0 0.12 0" />
        </filter>
        <filter id={u("grainSkyline")} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="1.3" numOctaves="2" seed="13" />
          <feColorMatrix values="0 0 0 0 0.92  0 0 0 0 0.75  0 0 0 0 0.38  0 0 0 0.16 0" />
          <feComposite in2="SourceGraphic" operator="in" />
        </filter>
      </defs>

      <rect width={CARD_W} height={CARD_H} fill={`url(#${u("sky")})`} />
      <rect width={CARD_W} height={CARD_H} filter={`url(#${u("grainWarm")})`} opacity="0.9" />

      <g transform={`translate(${CARD_W - 220} 200)`}>
        <circle cx="0" cy="0" r="200" fill={`url(#${u("sunhalo")})`} />
        <circle cx="0" cy="0" r="120" fill={`url(#${u("sunhalo")})`} opacity="0.5" />
        <circle cx="0" cy="0" r="68" fill={`url(#${u("sun")})`} />
        <circle cx="24" cy="-12" r="58" fill={`url(#${u("sky")})`} />
        <g style={{ mixBlendMode: "multiply" }}>
          <ellipse cx="-15" cy="10" rx="10" ry="7" fill={B.goldDp} opacity="0.18" />
          <ellipse cx="-25" cy="-12" rx="6" ry="5" fill={B.goldDp} opacity="0.14" />
          <ellipse cx="-5" cy="25" rx="7" ry="5" fill={B.goldDp} opacity="0.16" />
        </g>
      </g>

      <Spark3 x={CARD_W - 80} y={120} size={16} color={B.goldDp} rotate={-15} />
      <Spark3 x={CARD_W - 380} y={160} size={12} color={B.goldDp} rotate={25} />
      <Spark3 x={CARD_W - 100} y={310} size={10} color={B.goldDp} rotate={-40} />

      {(
        [
          [120, 90, 3, 0.5],
          [240, 60, 2, 0.45],
          [380, 100, 2.5, 0.4],
          [560, 70, 2, 0.5],
          [700, 130, 2.5, 0.45],
          [840, 90, 2, 0.4],
          [80, 200, 2, 0.4],
          [180, 280, 2.5, 0.5],
          [100, 350, 2, 0.45],
          [50, 130, 1.8, 0.4],
        ] as const
      ).map(([x, y, s, o], i) => (
        <circle key={i} cx={x} cy={y} r={s} fill={B.goldDp} opacity={o} />
      ))}

      <text
        x={CARD_W / 2}
        y="82"
        textAnchor="middle"
        fill={B.navy}
        fontFamily="var(--font-arabic)"
        fontSize="50"
        letterSpacing="6"
      >
        عيد مبارك
      </text>
      <text
        x={CARD_W / 2}
        y="112"
        textAnchor="middle"
        fill={B.navy}
        opacity="0.45"
        fontFamily="var(--font-body)"
        fontSize="11"
        fontWeight="700"
        letterSpacing="6"
      >
        EID MUBARAK
      </text>

      <g transform={`translate(0 ${CARD_H - 260})`}>
        <path
          d={`M0 80 Q150 60 240 78 T440 70 T660 88 T900 72 T1200 84 L1200 260 L0 260 Z`}
          fill="#0A1129"
          opacity="0.25"
        />

        <g fill={`url(#${u("skyline")})`} opacity="0.45">
          <rect x="50" y="110" width="20" height="150" />
          <path d="M60 100 L72 110 L48 110 Z" />
          <circle cx="60" cy="98" r="6" />
          <rect x="100" y="160" width="80" height="100" />
          <rect x="200" y="140" width="60" height="120" />
          <path d="M230 130 Q230 105 250 105 Q270 105 270 130 L270 145 L230 145 Z" />
          <rect x="300" y="170" width="100" height="90" />
          <rect x="420" y="150" width="70" height="110" />
          <rect x="510" y="170" width="60" height="90" />
        </g>

        <g fill={`url(#${u("skyline")})`}>
          <rect x="380" y="40" width="18" height="220" />
          <path d="M389 30 L400 40 L378 40 Z" />
          <rect x="383" y="60" width="12" height="6" />
          <circle cx="389" cy="26" r="5" />
          <line x1="389" y1="21" x2="389" y2="10" stroke={B.navy} strokeWidth="2" />
          <path d="M385 10 L393 10 L389 4 Z" fill={B.navy} />
          <path d="M460 130 Q460 95 490 95 Q520 95 520 130 L520 260 L460 260 Z" />
          <rect x="475" y="160" width="10" height="100" fill={`url(#${u("sky")})`} opacity="0.25" />
          <rect x="497" y="160" width="10" height="100" fill={`url(#${u("sky")})`} opacity="0.25" />
          <path d="M540 100 Q540 30 620 30 Q700 30 700 100 L700 260 L540 260 Z" />
          <g transform="translate(620 12) scale(0.9)">
            <path d="M0 -10 A10 10 0 1 1 -3 9 A7 7 0 1 0 0 -10 Z" fill={B.gold} />
          </g>
          <line x1="620" y1="22" x2="620" y2="34" stroke={B.gold} strokeWidth="2" />
          <path d="M580 160 Q580 140 595 140 Q610 140 610 160 L610 200 L580 200 Z" fill={`url(#${u("sky")})`} opacity="0.22" />
          <path d="M630 160 Q630 140 645 140 Q660 140 660 160 L660 200 L630 200 Z" fill={`url(#${u("sky")})`} opacity="0.22" />
          <path d="M720 130 Q720 95 750 95 Q780 95 780 130 L780 260 L720 260 Z" />
          <rect x="735" y="160" width="10" height="100" fill={`url(#${u("sky")})`} opacity="0.25" />
          <rect x="757" y="160" width="10" height="100" fill={`url(#${u("sky")})`} opacity="0.25" />
          <rect x="840" y="40" width="18" height="220" />
          <path d="M849 30 L860 40 L838 40 Z" />
          <rect x="843" y="60" width="12" height="6" />
          <circle cx="849" cy="26" r="5" />
          <line x1="849" y1="21" x2="849" y2="10" stroke={B.navy} strokeWidth="2" />
          <path d="M845 10 L853 10 L849 4 Z" fill={B.navy} />
        </g>

        <g fill={`url(#${u("skyline")})`} opacity="0.55">
          <rect x="900" y="170" width="70" height="90" />
          <path d="M935 158 Q935 130 960 130 Q985 130 985 158 L985 175 L935 175 Z" />
          <rect x="1000" y="140" width="50" height="120" />
          <rect x="1010" y="100" width="10" height="40" />
          <path d="M1014 95 L1020 100 L1009 100 Z" />
          <rect x="1070" y="160" width="80" height="100" />
          <path d="M1095 148 Q1095 125 1110 125 Q1125 125 1125 148 L1125 165 L1095 165 Z" />
          <rect x="1170" y="180" width="30" height="80" />
        </g>

        <rect x="0" y="0" width={CARD_W} height="260" filter={`url(#${u("grainSkyline")})`} />
      </g>

      <TrueILMLockup x={42} y={36} width={120} />
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────────────── */
/* CARD 3 — Blush (feminine, harmonised with navy + cream + gold)           */
/* ─────────────────────────────────────────────────────────────────────── */
function CardGildedOrnament({ uid }: { uid: string }) {
  const u = (s: string) => uid + s;
  const navy = "#192351";
  const cream = "#FEF7E6";
  const gold = "#EAC060";
  const blush = "#F2D8D0";
  const blushLt = "#F9E8E1";
  const pink = "#DC9A92";
  const pinkDp = "#B07069";

  return (
    <svg viewBox={`0 0 ${CARD_W} ${CARD_H}`} xmlns="http://www.w3.org/2000/svg" style={cardSvgStyle}>
      <defs>
        <linearGradient id={u("bg")} x1="0" y1="0" x2="0" y2={CARD_H} gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={cream} />
          <stop offset="60%" stopColor={blushLt} />
          <stop offset="100%" stopColor={blush} />
        </linearGradient>
        <radialGradient id={u("glow")} cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor={cream} stopOpacity="0.95" />
          <stop offset="60%" stopColor={cream} stopOpacity="0.35" />
          <stop offset="100%" stopColor={cream} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={u("petalGrad")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={blushLt} />
          <stop offset="100%" stopColor={pink} />
        </linearGradient>
        <filter id={u("grain")} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="1.3" numOctaves="2" seed="17" />
          <feColorMatrix values="0 0 0 0 0.10  0 0 0 0 0.14  0 0 0 0 0.32  0 0 0 0.08 0" />
        </filter>

        <pattern id={u("vine")} x="0" y="0" width="120" height="60" patternUnits="userSpaceOnUse">
          <g fill="none" stroke={navy} strokeWidth="1.4" strokeLinecap="round">
            <path d="M0 30 Q30 0 60 30 T120 30" opacity="0.85" />
            <ellipse cx="30" cy="14" rx="5" ry="3" fill={pink} stroke="none" opacity="0.85" transform="rotate(-30 30 14)" />
            <ellipse cx="90" cy="46" rx="5" ry="3" fill={pink} stroke="none" opacity="0.85" transform="rotate(30 90 46)" />
            <circle cx="0" cy="30" r="2" fill={gold} />
            <circle cx="60" cy="30" r="2" fill={gold} />
            <circle cx="120" cy="30" r="2" fill={gold} />
          </g>
        </pattern>

        <symbol id={u("petal")} viewBox="0 0 40 40">
          <path
            d="M20 4 Q26 12 26 20 Q26 28 20 36 Q14 28 14 20 Q14 12 20 4 Z"
            fill={`url(#${u("petalGrad")})`}
            opacity="0.7"
          />
        </symbol>

        <symbol id={u("bloom")} viewBox="0 0 60 60">
          {[0, 45, 90, 135, 180, 225, 270, 315].map((a, i) => (
            <ellipse
              key={i}
              cx="30"
              cy="14"
              rx="6"
              ry="11"
              fill={`url(#${u("petalGrad")})`}
              opacity="0.85"
              transform={`rotate(${a} 30 30)`}
            />
          ))}
          <circle cx="30" cy="30" r="6" fill={gold} />
          <circle cx="30" cy="30" r="2.5" fill={navy} />
        </symbol>
      </defs>

      <rect width={CARD_W} height={CARD_H} fill={`url(#${u("bg")})`} />
      <rect width={CARD_W} height={CARD_H} filter={`url(#${u("grain")})`} opacity="0.6" />
      <rect width={CARD_W} height={CARD_H} fill={`url(#${u("glow")})`} />

      <rect x="22" y="22" width={CARD_W - 44} height={CARD_H - 44} fill="none" stroke={navy} strokeWidth="1" opacity="0.45" />
      <rect x="32" y="32" width={CARD_W - 64} height={CARD_H - 64} fill="none" stroke={navy} strokeWidth="0.5" opacity="0.25" />

      <g>
        <rect x="60" y="58" width={CARD_W - 120} height="16" fill={`url(#${u("vine")})`} opacity="0.85" />
        <rect x={CARD_W / 2 - 90} y="46" width="180" height="40" fill={`url(#${u("bg")})`} />
        <use href={`#${u("bloom")}`} x={CARD_W / 2 - 18} y={48} width="36" height="36" />
        <EightStar x={CARD_W / 2 - 62} y={66} r={6} color={navy} opacity={0.6} />
        <EightStar x={CARD_W / 2 + 62} y={66} r={6} color={navy} opacity={0.6} />
      </g>

      <g>
        <rect x="60" y={CARD_H - 76} width={CARD_W - 120} height="16" fill={`url(#${u("vine")})`} opacity="0.85" />
      </g>

      {(
        [
          [100, 130],
          [CARD_W - 100, 130],
          [100, CARD_H - 130],
          [CARD_W - 100, CARD_H - 130],
        ] as const
      ).map(([x, y], i) => (
        <g key={i} transform={`translate(${x} ${y})`}>
          <EightStar x={0} y={0} r={28} color={navy} opacity={0.92} />
          <EightStar x={0} y={0} r={16} color={pink} opacity={0.9} />
          <circle cx="0" cy="0" r="4" fill={gold} />
          <EightStar x={0} y={0} r={42} color={navy} opacity={0.3} strokeOnly rotate={22.5} />
        </g>
      ))}

      {[180, 230, 280].map((d, i) => (
        <g key={i}>
          <EightStar x={100 + d} y={130} r={5} color={i % 2 === 0 ? pink : gold} opacity={0.75} />
          <EightStar x={100 + d} y={CARD_H - 130} r={5} color={i % 2 === 0 ? pink : gold} opacity={0.75} />
          <EightStar x={CARD_W - 100 - d} y={130} r={5} color={i % 2 === 0 ? pink : gold} opacity={0.75} />
          <EightStar x={CARD_W - 100 - d} y={CARD_H - 130} r={5} color={i % 2 === 0 ? pink : gold} opacity={0.75} />
        </g>
      ))}
      <circle cx={CARD_W / 2 - 220} cy={130} r="3" fill={gold} opacity="0.85" />
      <circle cx={CARD_W / 2 + 220} cy={130} r="3" fill={gold} opacity="0.85" />
      <circle cx={CARD_W / 2 - 220} cy={CARD_H - 130} r="3" fill={gold} opacity="0.85" />
      <circle cx={CARD_W / 2 + 220} cy={CARD_H - 130} r="3" fill={gold} opacity="0.85" />

      <use href={`#${u("petal")}`} x={210} y={210} width={26} height={26} transform="rotate(-25 223 223)" />
      <use href={`#${u("petal")}`} x={CARD_W - 240} y={360} width={30} height={30} transform="rotate(30 1184 375)" />
      <use href={`#${u("petal")}`} x={CARD_W / 2 - 360} y={420} width={20} height={20} transform="rotate(-10 250 430)" />
      <use href={`#${u("petal")}`} x={CARD_W / 2 + 330} y={170} width={18} height={18} transform="rotate(15 939 179)" />

      <Spark3 x={CARD_W / 2 - 280} y={250} size={11} color={gold} rotate={-15} />
      <Spark3 x={CARD_W / 2 + 280} y={350} size={11} color={gold} rotate={20} />
      <Spark3 x={CARD_W / 2 - 320} y={400} size={8} color={pinkDp} rotate={10} />
      <Spark3 x={CARD_W / 2 + 310} y={220} size={9} color={pinkDp} rotate={-25} />

      <text
        x={CARD_W / 2}
        y="170"
        textAnchor="middle"
        fill={navy}
        fontFamily="var(--font-arabic)"
        fontSize="46"
        letterSpacing="6"
      >
        عيد مبارك
      </text>
      <text
        x={CARD_W / 2}
        y="198"
        textAnchor="middle"
        fill={navy}
        opacity="0.5"
        fontFamily="var(--font-body)"
        fontSize="10"
        fontWeight="700"
        letterSpacing="6"
      >
        EID MUBARAK
      </text>

      <g transform={`translate(${CARD_W / 2} 222)`}>
        <line x1="-100" y1="0" x2="-14" y2="0" stroke={navy} strokeWidth="0.8" opacity="0.45" />
        <EightStar x={0} y={0} r={6} color={pinkDp} opacity={0.9} />
        <line x1="14" y1="0" x2="100" y2="0" stroke={navy} strokeWidth="0.8" opacity="0.45" />
      </g>
      <g transform={`translate(${CARD_W / 2} ${CARD_H - 130})`}>
        <line x1="-100" y1="0" x2="-14" y2="0" stroke={navy} strokeWidth="0.8" opacity="0.45" />
        <EightStar x={0} y={0} r={6} color={pinkDp} opacity={0.9} />
        <line x1="14" y1="0" x2="100" y2="0" stroke={navy} strokeWidth="0.8" opacity="0.45" />
      </g>
    </svg>
  );
}

/* ── Name overlay drawn on top of the card ────────────────────────────── */
function NameOverlay({
  recipient,
  sender,
  color = "#FEF7E6",
  accent = "#EAC060",
  shadow = true,
}: {
  recipient: string;
  sender: string;
  color?: string;
  accent?: string;
  shadow?: boolean;
}) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
        padding: "0 8%",
        paddingTop: "5%",
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-body)",
          fontWeight: 900,
          fontSize: "min(7.2cqi, 64px)",
          color,
          lineHeight: 1.05,
          letterSpacing: "-0.5px",
          textAlign: "center",
          textShadow: shadow ? "0 4px 16px rgba(0,0,0,0.25)" : "none",
        }}
      >
        {recipient}
      </div>
      <div
        style={{
          marginTop: "1.4%",
          fontFamily: "var(--font-body)",
          fontWeight: 600,
          fontSize: "min(2.4cqi, 22px)",
          color: accent,
          letterSpacing: "2px",
          textTransform: "uppercase",
          opacity: 0.9,
        }}
      >
        A gift from {sender}
      </div>
    </div>
  );
}

/* For the skyline (cream top) the overlay is navy and biased higher so it sits
   in the sky band rather than over the dark mosque silhouette. */
function SkylineOverlay({ recipient, sender }: { recipient: string; sender: string }) {
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: "40%",
        transform: "translateY(-50%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-body)",
          fontWeight: 900,
          fontSize: "min(7.2cqi, 64px)",
          color: "#192351",
          lineHeight: 1.05,
          letterSpacing: "-.5px",
          textAlign: "center",
          textShadow: "0 2px 12px rgba(254,247,230,.6)",
        }}
      >
        {recipient}
      </div>
      <div
        style={{
          marginTop: "4px",
          fontFamily: "var(--font-body)",
          fontWeight: 700,
          fontSize: "min(2.4cqi, 22px)",
          color: "#192351",
          letterSpacing: "2px",
          textTransform: "uppercase",
          opacity: 0.7,
        }}
      >
        A gift from {sender}
      </div>
    </div>
  );
}

/* ── Card registry + frame ─────────────────────────────────────────────── */

type OverlayProps = { recipient: string; sender: string; color?: string; accent?: string; shadow?: boolean };

export interface CardMeta {
  id: CardId;
  title: string;
  Card: React.ComponentType<{ uid: string }>;
  Overlay: React.ComponentType<OverlayProps>;
}

const OVERLAY_COLORS: Record<CardId, { color: string; accent: string; shadow: boolean }> = {
  lantern: { color: "#FEF7E6", accent: "#EAC060", shadow: true },
  skyline: { color: "#FEF7E6", accent: "#EAC060", shadow: false },
  ornament: { color: "#192351", accent: "#B07069", shadow: false },
};

export const CARDS: CardMeta[] = [
  { id: "lantern", title: CARD_TITLES.lantern, Card: CardLanternNight, Overlay: NameOverlay },
  { id: "skyline", title: CARD_TITLES.skyline, Card: CardHeritageSkyline, Overlay: SkylineOverlay },
  { id: "ornament", title: CARD_TITLES.ornament, Card: CardGildedOrnament, Overlay: NameOverlay },
];

export function getCard(id: string | null | undefined): CardMeta {
  return CARDS.find((c) => c.id === id) ?? CARDS[0];
}

/* A card "frame" — SVG plus optional name overlay, fit to the parent.
   useId() namespaces this instance's SVG defs so multiple copies don't collide. */
export function CardFrame({
  id,
  recipient,
  sender,
  showOverlay = true,
  small = false,
}: {
  id: CardId;
  recipient?: string;
  sender?: string;
  showOverlay?: boolean;
  small?: boolean;
}) {
  const rawId = useId();
  const uid = rawId.replace(/[^a-zA-Z0-9_-]/g, "") + "-";
  const meta = getCard(id);
  const ov = OVERLAY_COLORS[meta.id];
  const { Card, Overlay } = meta;
  return (
    <div className={"cardFrame" + (small ? " sm" : "")}>
      <Card uid={uid} />
      {showOverlay && recipient ? (
        <Overlay recipient={recipient} sender={sender ?? ""} color={ov.color} accent={ov.accent} shadow={ov.shadow} />
      ) : null}
    </div>
  );
}
