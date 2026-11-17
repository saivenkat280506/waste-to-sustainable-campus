# From Waste Campus to a Sustainable Campus — EVS Project Website

A hand-built, multi-page static website for the Environmental Studies (EVS) project
**"From Waste Campus to a Sustainable Campus"**, submitted by the students of
Hyderabad Institute of Technology and Management.

Every word of content comes from the project document: the title and selected challenge
track, the problem statement, the background and local context, the five objectives, the
five-unit EVS analysis (with Unit V treated in full), the risk assessment with practical
controls, the simplified EIA/EMP and the conclusion.

---

## How to open it

**No server, no build step, no install.**

1. Unzip the folder.
2. Open **`index.html`** — it works in any modern browser.

Everything runs from `file://`. The only external request is Google Fonts (Fraunces +
Karla); offline, the site falls back to Georgia and a system sans-serif and still looks
correct.

---

## Pages

| File | What it covers |
| --- | --- |
| `index.html` | Home — hero, the problem, the campus hotspot map, the five objectives, the five EVS units, the team |
| `project.html` | Title & selected challenge track, the before/after campus comparison, problem statement, background & local context, group members |
| `objectives.html` | The five objectives in depth, the interactive segregation lab, reuse in practice (seed paper & plant pots) |
| `evs-analysis.html` | Unit I–V analysis with a sticky in-page contents rail; Unit V — Social Issues & Sustainability in full |
| `risk.html` | The five risks and their controls, the three hard rules, the simplified EIA/EMP and the monitoring plan |
| `conclusion.html` | Conclusion, the project team and thank you |

---

## Folder structure

```
EVS_Waste_to_Sustainable_Campus_Website/
├── index.html
├── project.html
├── objectives.html
├── evs-analysis.html
├── risk.html
├── conclusion.html
├── README.md
├── assets/
│   ├── css/style.css        design system: tokens, components, responsive rules
│   ├── js/main.js           nav, progress, reveals, hotspots, sliders, lab
│   └── img/
│       ├── hero-campus.svg      campus scene: building, trees, labelled bins, plant pot
│       ├── compare-before.svg   the campus today — litter and one overflowing bin
│       ├── compare-after.svg    the same campus with the plan in place
│       ├── campus-map.svg       top-down campus plan used for the hotspot pins
│       ├── cycle-loop.svg       five-step circular loop (Reduce → … → Review)
│       ├── value-chain.svg      paper and plastic, two separate journeys
│       ├── sorting-bins.svg     wet / paper / plastic bins
│       ├── seed-paper.svg       recycled paper sheet with a seedling
│       ├── plant-pot.svg        reused container becoming a plant pot
│       ├── earth-layers.svg     soil cross-section, litter → soil → water
│       ├── leaf-rule.svg        ornamental divider
│       ├── campus-original.jpg  campus photo from the source deck
│       ├── campus-duotone.jpg   the same photo, duotoned green + cream
│       └── favicon.svg
└── screenshots/              viewport-sized review shots (1440×900 and 390×844)
```

Every illustration is an original hand-authored SVG written for this site — no stock art,
no placeholder images.

---

## Interactive modules

| Where | What it does |
| --- | --- |
| `index.html` | **Campus hotspot map** — click any of the eight pins on the plan (or its tab) to read what happens at that spot. |
| `index.html` | **Objectives scroller** — arrow buttons and a drag bar walk through the five objectives. |
| `index.html` | **Scroll counters** — the five objectives count up as the sidebar enters view. |
| `project.html` | **Before / after campus** — drag the divider (or use ← → keys) to wipe between the campus today and the campus with the plan in place. |
| `objectives.html` | **Segregation lab** — drag each item into the right labelled bin, or tap an item and then tap its bin. Wrong answers explain themselves. |
| `objectives.html` | **Objective accordion** — each objective opens to show the EVS unit it maps to and the action it asks for. |
| `evs-analysis.html` | **Sticky contents rail** — the unit you are reading is highlighted as you scroll. |
| `risk.html` | **Risk accordion** — each risk opens to show the consequence and the control. |
| Every page | Scroll progress bar, scroll reveals, back-to-top button, working mobile menu. |

---

## Design

- **Palette** — campus greens (`#4B9732` is sampled directly from the source deck's
  green), warm paper white, and light chocolate brown for earth, timber and reuse. The
  palette is fixed across every page.
- **Type** — Fraunces for display, Karla for text.
- **Layout** — an editorial website rather than a slide deck: reading columns with drop
  caps, sticky sidebars, numbered link-index rows, figure captions and a horizontal
  scroller, instead of repeated blocks of cards.
- **Motion** — IntersectionObserver reveals plus a deterministic scroll sweep, so nothing
  can get stuck invisible. Everything respects `prefers-reduced-motion`.
- **Accessibility** — semantic landmarks, labelled controls, keyboard-operable slider
  and accordion, visible focus rings, `aria-live` feedback in the lab.

---

## The project in one line

Reduce · Segregate · Reuse · Recycle · Review

Team — G. Chaitnaya (26E51A05A3) · D. Pranika (26E51A0580) · Harsha (26E51A05A1) ·
D. Mohan (26E51A0578)
