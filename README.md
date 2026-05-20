# True ILM · Send the gift of Eid

A web flow for sending an **Eid gift card** to a friend or family member. The
recipient gets a personalised link, sees their card, and claims **1 month of
free access** to True ILM (Islamic audiobooks + eBooks).

Built from a [Claude Design](https://claude.ai/design) handoff. Next.js 15
(App Router) + TypeScript, deploys to Vercel.

## Flow

- **`/`** — the sender flow, responsive:
  - **Desktop**: split-screen, editorial layout. Form on the left, the live
    card preview always on the right.
  - **Mobile**: stacked two-step flow.
  - **Step 1 · Choose** — pick one of three card colours.
  - **Step 2 · Personalise** — choose how to send (WhatsApp / Email / Copy
    link), add the recipient + your name, and a note.
  - **Send** builds a real shareable gift link and opens WhatsApp / the mail
    client, or copies the link.
- **`/gift?c=…&to=…&from=…&note=…`** — the recipient page. Reads the gift
  details from the URL and renders the personalised card, the sender's note,
  what's inside, and a "Claim your free month" CTA. This is what the link in
  the WhatsApp/email message opens.

## The three card designs (`components/cards.tsx`)

All landscape 1200×600 SVG, brand palette only (navy `#192351`, gold
`#EAC060`, cream `#FEF7E6`), name overlay drawn on top in code.

1. **Lantern Night** — deep navy, glowing gold lantern, crescent + stars.
2. **Heritage Skyline** — cream sky, navy mosque silhouette, gold crescent.
3. **Blush** — cream→blush wash, navy ornament, dusty-rose + gold accents.

The True ILM lockup is the original brand SVG (vector paths, never recoloured).

## Fonts

- **Body** → Nunito Sans (brand)
- **Display** → Familjen Grotesk — the closest free match for the brand's
  Conglomerate (paid, Adobe Fonts). To use the real face, prepend your
  Conglomerate kit to `--font-display` in `app/globals.css`.
- **Arabic** → Amiri

## Develop

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

> Requires Node ^18.18 / ^19.8 / >=20. Pinned to Next.js 15 for Node 19
> compatibility; Vercel builds run on Node 24.

## Deploy

```bash
vercel           # preview
vercel --prod    # production
```

The design handoff bundle lives in `design_pkg/` (gitignored) for reference.
