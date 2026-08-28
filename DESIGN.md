# TTC Design System

Single source of truth for the Turn To Christ Commission landing page. Use this to build new sections and components without re-deriving colors, spacing, shape, or animation from the existing code.

**Stack:** React 19 + TypeScript, Tailwind CSS v4 (`@tailwindcss/vite`), Framer-Marionette `motion/react`, `lucide-react` icons. Content comes from the CMS (`@/lib/defaultContent` + `@/lib/api`), never hardcoded.

---

## 1. Foundation

### 1.1 Color Tokens

The palette is blue-dominant with orange accents. There is **no** `tailwind.config.js` — Tailwind v4 reads `@theme` in `src/index.css`. All colors below are arbitrary values unless noted.

| Role | Hex / Class | Usage |
|------|-------------|-------|
| Primary blue (deep) | `bg-#0a1a3a` | Hero / footer background |
| Primary blue (brand) | `bg-blue-600` | Solid buttons, banner, icon chip backgrounds |
| Primary blue (card) | `bg-blue-700` | Mission card, Thank You panel |
| Accent orange | `bg-orange-600` / `text-orange-500` | Primary CTA, quote bar, logo subline |
| Accent hover | `bg-orange-700` | CTA hover |
| Card tint | `bg-gray-50` / `border-gray-100` | Most neutral card surfaces |
| Stat / heading text | `text-gray-900` | Main headings and body-on-white |
| Muted body | `text-gray-500` | Descriptions, subtitles |
| Deep text on navy | `text-blue-100` / `text-blue-50` | Body text on dark brand panels |
| Navy panel text | `bg-white/10`, `border-white/20` | Chips / outlines on dark backgrounds |

Hardcoded hex that appears more than once and should be reused as-is:
- `#0a1a3a` – navy hero/footer
- `#071329` – darker navy (loading screen)

### 1.2 Typography

- **Font:** Inter (loaded via Google Fonts in `src/index.css`), `--font-sans`. JetBrains Mono available as `--font-mono` but unused on the page.
- **Display scale** (section titles):
  - H1 (hero): `text-6xl md:text-8xl font-black tracking-tighter leading-none`
  - H2 (major section): `text-4xl md:text-5xl font-black tracking-tight`
  - H2 (utterance/uppercase, e.g. "EMPOWERING STUDENTS", "OBJECTIVES"): `text-4xl md:text-5xl font-black uppercase`
- **Section header pattern** (reuse everywhere):
  ```
  <div className="text-center mb-16 space-y-4">
    <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">{title}</h2>
    <p className="text-gray-500 font-medium max-w-3xl mx-auto italic">{subtitle}</p>
    <div className="w-16 h-1.5 bg-blue-600 mx-auto rounded-full" />
  </div>
  ```
  Hover is `italic` on the subtitle for most sections; `Object` and a few others omit it. Keep the 4-line structure (`title → subtitle → rule`).

### 1.3 Shape Language

The design leans heavily on large border radii and pill buttons.

- **Buttons:** `rounded-xl` (navbar + hero), `rounded-full` (hero secondary-ish "Learn More" / "Donate" pill CTAs in Thank You and Scholarship cards).
- **Cards:** `rounded-[40px]` (mission/vision, objectives, empowering, get-involved, rewards), `rounded-2xl` (stat tiles, icon chips, contact inputs), `rounded-3xl` (why-choose tiles), `rounded-[50px]` (Scholarship card, Thank You panel, contact wrapper).
- **Icon chips:** `rounded-2xl` (squircle) sized `w-12 h-12` / `w-14 h-14` / `w-16 h-16`.
- **Hero divider:** an inline SVG wave (`fill-white`, `preserveAspectRatio="none"`, `h-12`, absolute `bottom-0`, `z-20`). The hero carries `pb-28` so the button row clears the wave.

### 1.4 Spacing Rhythm

- Section vertical padding: **`py-24`** (about, mission, empowering, why-choose, get-involved, contact, rewards). `py-16` for the slim Education banner. `pt-20 pb-28` on hero.
- Content container: **`max-w-7xl mx-auto px-6`** (navbar, hero, sections, footer). Contact is `max-w-4xl`.
- Inner grid gaps: `gap-8` (tile grids), `gap-16` (two-column splits).
- Between stacked content blocks: `space-y-4` / `space-y-6` / `space-y-8` / `space-y-12` depending on hierarchy. Section header uses `mb-16 space-y-4`.

### 1.5 Shadows

No shadow tokens in CSS; shadows are used inline. Recurring recipe:
- Card hover lift: hover card `shadow-sm` → `hover:shadow-xl` (with `transition-all`, plus `motion.div` `whileHover={{ y: -5 }}` or `-10` where used).
- Colored glow shadows (verify tailwind-merge support in v4; these reverse on plain classes and appear on specific CTAs): `shadow-2xl shadow-orange-600/30` (hero primary), `shadow-xl shadow-blue-600/20` (footer contact submit).
- Brand panel: `shadow-3xl shadow-blue-700/30` (Thank You panel), `shadow-3xl` (Scholarship card).

---

## 2. Motion / Animation

Uses `motion/react` (screen-reader-safe `motion.div`, `useScroll`, `useTransform`).

| Trigger | Where | Pattern |
|---------|-------|---------|
| Hero enter | Hero title/subtitle block | `initial={{ opacity: 0, y: 30 }}` → `animate={{ opacity: 1, y: 0 }}`, `duration 0.8` |
| Hero buttons stagger | Hero CTA row | same as above, `delay: 0.2` |
| Card hover lift | Mission/Vision cards | `whileHover={{ y: -5 }}` |
| Card hover lift (bigger) | Empowering cards, section body | `whileHover={{ y: -10 }}` |
| Scroll-driven nav | Fixed navbar | `useScroll()` → `useTransform(scrollY, [0,50], …)` mapping bg rgba, `backdropFilter blur`, box-shadow |
| Scroll-in (static) | Empowering header | Tailwind `animate-in fade-in duration-700` (via tailwindcss-animate if present; if not present, relies on motion instead — keep consistent) |
| Success state | Contact submit OK | `initial={{ opacity: 0, scale: 0.9 }}` → `animate={{ opacity: 1, scale: 1 }}` |

**Rules:** animate only opacity/transform (never layout). Entrance animations are `opacity + y`, never x-scale. Durations `0.8s` (hero) and single `duration-700` used for CSS-based fade.

---

## 3. Core Reusable Components

These get used repeatedly and are the candidates to extract into `src/components/ui` as new work lands. The page currently defines them inline in `src/pages/Landing.tsx`.

### 3.1 `Button`

Three variants exist with distinct purposes and shapes:

| Variant | Classess | Purpose |
|---------|----------|---------|
| **Primary (orange)** | `px-10 py-4 bg-orange-600 text-white rounded-xl font-black text-lg hover:bg-orange-700 hover:scale-105 active:scale-95 flex items-center gap-3 shadow-2xl shadow-orange-600/30` | Main "Get Involved" CTA in hero + navbar variant (`px-6 py-2 rounded-xl text-sm shadow-lg shadow-orange-600/20`), Thank You pill (`px-12 py-5 rounded-full bg-orange-500`). |
| **Secondary (outline)** | `px-10 py-4 border-2 border-white/20 text-white rounded-xl font-black text-lg hover:bg-white/10 active:scale-95 backdrop-blur-sm` | "Learn More" on dark hero; navbar variant `border-2 border-blue-600 text-blue-600 hover:bg-blue-50` on light bg. |
| **Blue (accent)** | `px-8 py-4 bg-blue-600/90 text-white rounded-xl ... flex items-center gap-3 shadow-lg` | "Donate" hero solid blue; contact submit `w-full py-5 bg-blue-600 rounded-2xl text-xl`. |
| **White (on brand)** | `px-10 py-4 bg-white text-blue-900 rounded-full font-black text-lg hover:bg-blue-50 flex items-center gap-3` | Scholarship card "Learn More". |

**Icon pattern:** CTA buttons often include a `lucide-react` icon with explicit size class (`w-5 h-5` / `w-7 h-7`) and `flex items-center gap-3` (or `gap-2` for small navbar buttons). Add `<ArrowRight />` after label for "forward" actions.

### 3.2 `SectionHeader`

The standardized top-of-section block from §1.2. Always: centered, `mb-16`, `space-y-4`, title + optional italic subtitle + `w-16 h-1.5 bg-blue-600 rounded-full` rule. Some sections replace the rule width (use `w-20 h-2` in Empowering to emphasize). Accept an optional `eyebrow` prop (see Why-Choose: `text-xs font-black text-blue-600 uppercase tracking-widest` appears above the title).

### 3.3 `Card`

Default surface: `p-8/p-10 bg-white rounded-[40px] shadow-sm border border-gray-100 hover:shadow-xl transition-all`. Used for objectives, get-involved, rewards. On gray sections (`bg-gray-50`) cards stay white; on white sections cards are tinted `bg-gray-50` with `border-gray-100`. Card internals use `space-y-4`/`space-y-6`.

### 3.4 `StatTile`

`grid grid-cols-2 gap-4`, each tile `p-6 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col justify-center` with a `text-3xl font-black text-blue-700` value and `text-xs font-bold text-gray-500 uppercase tracking-widest` label.

---

## 4. Page Sections (lan/map)

Order and anchors as they appear on the page (`src/pages/Landing.tsx`, `id` used by nav links):

| # | Section | Anchor | Background | Layout |
|---|---------|--------|-----------|--------|
| 1 | Hero | `#home` | navy `#0a1a3a` + image `opacity-30` + left gradient | full-screen, left-aligned `max-w-3xl`, subtitle chip, quote with left orange border, 3-button row, bottom SVG wave |
| 2 | About | `#about` | `bg-white` | 2-col (`md:grid-cols-2 gap-16`): image w/ location badge + text + `grid-cols-2` stats |
| 3 | Mission & Vision | `#mission` | `bg-white` | centered header, 2-col split: blue Mission card + outlined Vision card |
| 4 | Objectives | — | `bg-gray-50` | centered header, `grid md:grid-cols-3` numbered cards (blue square number chip) |
| 5 | Empowering | `#programs` | `bg-white` | header + `grid md:grid-cols-2 lg:grid-cols-3` image cards + full-width Scholarship `rounded-[50px]` card |
| 6 | Why Choose | — | `bg-white` | 2-col: `grid-cols-2` feature tiles (left) + square image with floating blue `100%` badge (right) |
| 7 | Get Involved | `#get-involved` | `bg-gray-50` | centered header, `grid md:grid-cols-3` icon cards |
| 8 | Contact | `#contact` | `bg-white` | `max-w-4xl` white card w/ form; success state swaps to check icon |
| 9 | Education banner | — | `bg-blue-600` | `flex` left bullets + vertical divider + "Transforming Communities" |
| 10 | Partnership Rewards | — | `bg-white` | centered header, `grid md:grid-cols-3` icon cards |
| 11 | Thank You | — | `px-6` wrapper | `bg-blue-700 rounded-[50px]` centered panel + orange pill CTA |
| 12 | Footer | — | `#0c1626` | `grid md:grid-cols-4` (brand spans 2), contact + phones; bottom bar w/ admin link |

---

## 5. Navbar & Footer

### Navbar
Fixed `top-0 z-[100] h-20`, `max-w-7xl mx-auto px-6`. Transparent over hero, transitions to white/90 + blur + shadow `[0,50]` scroll range. Left: logo image + stacked `logoText`/orange `logoSub`. Center (lg): nav links (13px bold, gray→blue on scroll). Right (md): orange + outlined blue CTAs. `lg:hidden` hamburger opens a `bg-white` panel (`top-20`, `shadow-xl`).

### Footer
`bg-#0c1626` `py-24` with two decorative blurred circles (`bg-blue-600/10`, `bg-orange-500/5`, `blur-[120px]`). Brand column (logo, subtitle reuse from hero, social pills `w-10 h-10 rounded-full bg-white/5 border-white/10`). Column headers: `text-xs font-black text-gray-500 uppercase tracking-[0.2em]`. Bottom bar: dynamic year `© {new Date().getFullYear()}` + `Admin Dashboard` link (`/admin`) + "Made with ❤ for the Gospel".

---

## 6. Content Plumbing (how sections get data)

Every section renders from `content.<key>` where `content = { hero, about, missionVision, objectives, empowering, whychoose, getInvolved, education, partnershipRewards, thankYou, contact, navbar, branding, seo }`.

`getSectionData(key)` (in `Landing.tsx`) merges the fetched record over `DEFAULT_CONTENT[key]`, so the admin editor (see `SectionEditor.tsx`) can override any field. **Conventions when adding a new section:**

1. Add a default block to `@/lib/defaultContent.ts`.
2. Add the key to the `content` object in `Landing.tsx`.
3. All keys in the shape `{ key: string, ... }` are mapped with `.map((item: any, i: number) => …)` — avoid assuming a fixed array length; iterate.
4. Reuse `SectionHeader`, `Card`, `Button` patterns from §3 rather than re-declaring classes.
5. Confirm a matching admin editor entry in `Admin.tsx` (`sections` list) if the field is user-editable.

---

## 7. Editing & Validation

- **Lint/typecheck:** `pnpm lint` (`tsc --noEmit`). **Build:** `pnpm build`.
- **Run:** `pnpm dev` (port 3000).
- Type safety: the code heavily uses `(item as any)` / `(content as any)[key]` — the CMS shapes are intentionally loose. Keep new fields optional and defensive.
- New UI work → extract to `src/components/ui/*.tsx` and import; do not grow `Landing.tsx` further than it already is (`959` lines).

---

## 8. Checklist for a New Section

- [ ] Add `DEFAULT_CONTENT[key]` + merge into `content` in `Landing.tsx`
- [ ] Use `SectionHeader` (centered, `mb-16 space-y-4`, blue rule)
- [ ] `max-w-7xl mx-auto px-6` container, `py-24` section padding
- [ ] Cards `rounded-[40px]` (or `rounded-2xl`/`rounded-3xl` for smaller surfaces), `bg-white` or `bg-gray-50`
- [ ] Alternate section backgrounds white ↔ `bg-gray-50`
- [ ] Icon chips `rounded-2xl` with `w-12 h-12` etc., using `lucide-react`
- [ ] Accessible motion: only opacity/transform, `whileHover={{ y }}` for cards
- [ ] Buttons match one of the four variants (§3.1)
- [ ] `pnpm lint && pnpm build` before done
