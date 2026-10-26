# Vault Financial Services (VFS) — Claude Handoff Brief

**Purpose:** Self-contained briefing so Claude (or any research assistant) understands what has been built, what is intentionally unfinished, and how to run useful market analysis without inventing rates, NMLS IDs, or fake metrics.

**As of:** 2026-10-06 (repo inspection + open draft PRs)  
**Live demo:** https://vfs-swart.vercel.app  
**Repo:** https://github.com/kabi-solutions/VFS  
**Production deploy:** GitHub `master` → Vercel auto-deploy (treat `master` as production)

---

## 1. What VFS is

Vault Financial Services is an **institutional private / investor real estate credit** brand with two surfaces in one Next.js app:

1. **Marketing site** — investor-facing product education, capital-partner diligence narrative, trust/licensing placeholders, state market landings, resources, and Apply.
2. **Role-based loan portal** — SaaS-style workspaces for **borrower, vault (ops), processor, lender, and escrow**, with a published loan lifecycle from application through funding.

**Business framing (product, not legal advice):**
- Audience is **real estate investors / operators**, not consumer purchase-money owner-occupants.
- Credit is framed as **business-purpose / non-owner-occupied**.
- Vault sits between originations and capital: **capital partners = lenders** in product language (deploy capital into a gated pipeline). Processors and escrow are network roles on the file.
- Public pages describe **structure and fit**, not rate sheets. Specific terms are **deal-by-deal after Apply**.

Legal entity name used in SEO/metadata: **Vault Financial Services LLC**. Canonical production domain is still a placeholder in code (`NEXT_PUBLIC_SITE_URL` / `www.vaultfinancial.example`); the current public demo host is the Vercel URL above.

---

## 2. Stack

| Layer | Choice |
| --- | --- |
| Framework | **Next.js 16** App Router (`src/app`) |
| Language | **TypeScript** |
| UI | **React 19**, **Tailwind CSS v4**, Geist font |
| Forms (Apply WIP) | react-hook-form + zod on production Apply; expanded wizard on PR branches; **xlsx** for schedule/budget import on package PRs |
| Data today | **In-browser mock layer** (`src/lib/mock/*`) + `localStorage` persistence for demos |
| Data planned | **Supabase** — schema defined in `supabase/schema.sql`, TypeScript mirrors in `src/lib/types/database.ts`; **not fully wired** (no live Auth/DB/Storage in the app yet) |
| Hosting | **Vercel** (project `vfs` under `kabi-solutions`) |
| Repo access | Shared GitHub account **`kabi-solutions`** (intentional for now) |

**Agent / deploy discipline:** `.cursor/rules/vfs-deploy-gate.mdc` — do not push/merge to `master` unless explicitly asked; feature branches + draft PRs are the normal handoff path.

---

## 3. Live vs in-repo reality

### Live on production (`master` → https://vfs-swart.vercel.app)

- Full **marketing** IA (solutions, capital partners, company, resources, trust, locations, contact, login).
- **Apply** as a shorter multi-step form (property → borrower → loan + docs) that creates a mock application + portal session.
- **Portal** with role switcher, pipelines, application workspace, messages/docs shells, mock seed data.
- Supabase **schema file present**; runtime still mock.
- Homepage still contains **internal metric placeholders** such as `$[XXX]M+ deployed · [XX] states` (not real figures — do not treat as published KPIs).

### In progress on draft PRs (not production until merged)

See §7. Broadly: marketing copy polish (PR #1); **borrower package expansion** (PR #2); Vault/CFSI document packages into soft-completeness (PR #3, related to / possibly absorbing into #2).

---

## 4. Marketing surface

### Brand

- Visual system: **black / charcoal ink on light paper** with **green accent** (`#00b85c` and soft greens). CSS variables in `src/app/globals.css`.
- Tone: institutional, diligence-friendly, deal-first — avoid consumer mortgage clichés and invented APR/LTV tables.
- Logo: `/brand/vault-logo.png`.

### Primary routes (marketing)

| Area | Routes |
| --- | --- |
| Home | `/` |
| Solutions | `/solutions/private-money`, `/rehab-fix-flip`, `/bridge-loans`, `/ground-up`, `/dscr-non-qm` |
| Apply / login | `/apply`, `/login` |
| Capital partners | `/capital-partners`, `/deployment`, `/apply` |
| Company | `/company/about`, `/leadership`, `/press`, `/careers`, `/community-impact` |
| Resources | `/resources`, `/glossary`, `/faqs`, `/case-studies`, guides under `/resources/guides/*` |
| Trust | `/trust/licensing`, `/security`, `/legal` |
| Locations | `/locations`, `/locations/[state]` |
| Contact | `/contact` |

Nav mega-menus mirror these groups (`SiteHeader`).

### Solutions (product menu)

Marketing products (5 pages):

1. **Private Money** — umbrella / custom private capital; first & second trust deed options evaluated case by case.
2. **Rehab / Fix & Flip** — purchase + rehab scope framing; draws when rehab funds reserved.
3. **Bridge Loans** — transitional hold; exit to sale / refinance / DSCR takeout when appropriate.
4. **Ground-Up Construction** — milestone / draw schedule framing.
5. **DSCR & Non-QM** — rental cash-flow qualification emphasis; no published minimum DSCR on site.

**Note:** Apply/schema loan enum on package branches also includes **`new_construction`** as distinct from `ground_up`. There is **no separate New Construction marketing page** today; marketing “Ground-Up” covers construction narrative. Treat New Construction as an Apply/ops loan-type refinement in WIP, not a sixth public product page.

### Capital partners

- Messaging: deploy into a **gated, auditable pipeline** (not a black-box desk).
- Partner application + deployment explainers exist.
- Explicit public claim: **no published LTV or APR figures**.

### Resources & trust

- Guides (hard money, fix-flip 101, DSCR explained), glossary, FAQs, case-study **shells**.
- Licensing page: **no NMLS / license IDs** until counsel supplies a compliance pack. Location pages ≠ license roster.
- Legal/privacy: interim outlines pending counsel.
- Many company pages (leadership bios, press, careers, community impact metrics) still marked **PLACEHOLDER** in source — do not invent people, % of deals, or press hits.

### Locations (starter markets)

Dynamic state landings for: **CA, TX, FL, AZ, NV, GA, NC, CO, WA, TN**.  
Copy states Vault is prepared to **discuss** investor files there — **not** that every license is published. Default subject state in Apply package scaffolding often defaults toward **NV** (Southern Nevada / community-impact narrative) but markets are multi-state.

### Homepage funding path

Six-step image-led lifecycle (marketing language): Application → Initial review → Package → Underwriting → Clear to close → Signing & funding. Aligns with portal status model (see §6).

---

## 5. Apply / borrower package

### Product rule: hard vs soft required

**Hard-required to submit** (package expansion / PR #2+ — current design target):

- Borrower first name, last name, email, phone  
- Subject property street address  
- Loan type  
- Loan amount  
- **Business-purpose / non-owner-occupied attestation**

**Soft-required for package completeness** (submit still allowed with gaps; portal lists missing items):

- Full borrower / co-borrower profile (marital, residence, credit/income/liquidity estimates, employment)
- Declarations questionnaire + ECOA appraisal notice + credit/background authorization
- Full subject property block, vesting, interior access / escrow / insurance contacts
- Strategy & exit, refinance detail when applicable
- **Track Record** (typically ≥1 complete project in last-24-months framing)
- **SREO** schedule (Schedule of Real Estate Owned; more rows if cross-collateralization)
- **Construction budget** (levels 1–5, finish level, line items and/or Excel/PDF) when rehab / ground-up / new construction / rehab-or-upgrade applies
- **Owner-builder vs GC** (mutually exclusive; Vault **F-008** framing) + CFSI rehab contractor fields/docs when contractor package applies
- Core docs (bank statements, photo ID, entity docs, purchase contract / payoff, leases, contractor insurance/license/W-9, etc. as conditional)

**Production `master` Apply today** is still the **shorter** zod form (property + borrower + loan + optional docs) — **without** the full soft-complete package UI. Soft-complete package expansion is **in progress on PR #2** (see §7).

### Package completeness

- Helper: `getPackageCompleteness()` in `src/lib/apply/package.ts` (on package branches).
- Portal: `PackageCompletenessPanel` on application workspaces — groups missing soft items for ops/follow-up.
- `package` JSON + `package_complete` boolean on `loan_applications` (schema + types on package branches).

### Notable domain rules already encoded

- Investor loans: answering **Yes** to “intend to occupy as primary” is treated as a **package conflict**.
- **50%+ structure expansion** forces Ground-Up or New Construction loan-type framing.
- Owner-builder and GC are **mutually exclusive**.
- Attestation copy still includes counsel **placeholder** language — replace before production legal reliance.
- Documents are **metadata-only** in mock (no real Supabase Storage upload).

### CFSI / Vault form mapping (WIP on PR #3 / absorbing into #2)

| Package | Intent in product |
| --- | --- |
| Loan Submission Package | Declarations, ECOA/credit auth, refinance/strategy, SREO/track-record enrichments, core soft docs |
| Construction Budget (**F-028**) | Conditional Budget step; line items + Excel import |
| Owner Builder / GC (**F-008**) | OB vs GC role + profiles |
| Rehab Financing (CFSI GC) | Contractor/project submission + required GC docs when rehab financing applies |

---

## 6. Portal

### Roles

| Role | Portal home | Focus |
| --- | --- | --- |
| **Borrower** | `/portal/borrower` | Applications, documents, messages, new Apply |
| **Vault** (ops) | `/portal/vault` | Pipeline, review queue, assignments, organizations, attribution reporting |
| **Processor** | `/portal/processor` | Workqueue, info requests, documents |
| **Lender** | `/portal/lender` | Underwriting queue, conditions, clear to close |
| **Escrow** | `/portal/escrow` | Closing queue, document intake, recording |

Demo **role switcher** + “Reset demo data” live in `PortalShell`. Login is **mocked** (`/login`).

### Lifecycle statuses (canonical enum)

`application_submitted` → `initial_review` → `loi_issued` → `package_submission` → `info_requested` → `underwriting` → `clear_to_close` → `closing_prep` → `signing_funding` → `funded`  
(plus `denied`)

- `info_requested` can tag **`info_requested_from`** so the file snaps back to the originating stage after gaps are filled.
- Status history is modeled as append-only **`status_events`** (schema comment + mock).

### Org types (schema)

`vault` | `processor` | `lender` | `escrow` | `capital_partner`  
Org status: `pending_review` | `active` | `inactive` | `rejected`.

### Apply → portal access (locked decision)

Submitting Apply **creates portal access** (mock: creates/links borrower user, sets session keys, seeds application). Marketing and login copy reinforce that durable portal access follows Apply / org setup — not a separate “request a demo account” product for borrowers.

---

## 7. Open PRs / branches (current reality)

Inspected via `gh pr list` / git tips. All three are **DRAFT**, base **`master`**.

| PR | Branch | Title | Status notes |
| --- | --- | --- | --- |
| **[#1](https://github.com/kabi-solutions/VFS/pull/1)** | `cursor/marketing-copy-funding-path-9fbe` | Marketing copy refresh + image-led funding path | Removes customer-facing placeholder metric language; strengthens funding lifecycle presentation. **Not on production yet** (prod homepage still shows `$[XXX]`-style placeholders). |
| **[#2](https://github.com/kabi-solutions/VFS/pull/2)** | `cursor/borrower-application-package-9fbe` | Expand borrower Apply with soft-complete package fields | **Package expansion in progress.** Multi-step soft-complete Apply, Track Record/SREO Excel, `new_construction`, completeness panel. |
| **[#3](https://github.com/kabi-solutions/VFS/pull/3)** | `cursor/apply-document-requirements-07d5` | Wire Vault/CFSI document packages into Apply completeness | Stacked relative to #2 (declarations, F-028 budget, F-008 OB/GC, CFSI rehab docs). **May be folded into / absorbed by PR #2** — treat as related WIP, not a separate production track. |

**Caveat for researchers:** Do not assume PR previews = production. When describing “what borrowers see live,” prefer **`master` / vfs-swart.vercel.app**. When describing the **intended Apply package**, prefer PR #2/#3 design.

---

## 8. Explicit non-goals / gaps

Do **not** assume these exist or invent stand-ins:

- **No live Supabase Auth / RLS / Storage** — mock session only.
- **No real rates, APR, LTV, DSCR cutoffs, or close-time SLAs** on the public site (and none should be invented for copy or research decks unless Vault supplies them).
- **No published NMLS IDs or state license roster** — counsel/compliance owned.
- **No real document vault** — uploads are mock metadata.
- **No production metrics** — homepage `$[XXX]M` / state counts are placeholders; community-impact %, leadership bios, press list, careers ATS are unfinished.
- **E-SIGN / final lending disclosures** — pending counsel.
- **Canonical custom domain** — still env/placeholder; demo is on Vercel.
- **Automated underwriting / pricing engine** — not in scope of current build.
- README is still mostly create-next-app boilerplate — product truth lives in app code + this brief.

---

## 9. Locked product decisions (preserve for research & build)

1. **Qualitative rates only** on marketing — structure/fit narrative; terms after Apply.
2. **Capital partners = lenders** (capital providers), diligence via gates + audit trail.
3. **Apply creates portal access** — one digital file, durable status history.
4. **Business-purpose / non-owner-occupied** is a hard attestation (investor credit framing).
5. **Hard submit vs soft package** — low friction to start; completeness chased in portal.
6. **Private Money is umbrella**; specialized products are rehab, bridge, ground-up, DSCR (new construction as loan-type refinement in package WIP).
7. **Locations discuss markets; Trust publishes licenses** — never invent IDs.
8. **Role-based portal** with processor/lender/escrow assignment model is core differentiation vs “form-only hard money site.”
9. **Status history / info-requested loops** are part of the diligence story for capital partners.
10. **Production = `master`** — Cloud Agents use feature branches + draft PRs; no silent production merges.
11. **Shared GitHub `kabi-solutions`** is intentional for now.
12. Case studies and social proof stay **qualitative** until Vault approves anonymized funded narratives.

---

## 10. Competitive / market research framing (for Claude)

### Positioning hypothesis to test (not proven claims)

- “Institutional private credit for investors” + **auditable lifecycle** + **role-based portal** vs broker rate-sheet sites and consumer Non-QM brands.
- **DSCR** as rental takeout / permanent path adjacent to bridge and private money — not the only product.
- **Rehab + construction budget/fund-control narrative** (draws, OB vs GC, CFSI-style packages) as operational differentiation.
- Trust posture: **under-claim licensing** until packs are real — research what peers publish vs bury.

### Suggested competitor sets (start lists; expand with search)

- National / multi-state **hard money & private lenders** with strong digital Apply (e.g. brands in fix-flip / bridge: RCN, Lima One, Kiavi, Easy Street, local NV/CA private money shops — verify current names/positioning yourself).
- **DSCR / Non-QM investor mortgage** platforms (vis-à-vis rental cash-flow messaging).
- **Marketplace / marketplace-lender** models vs **balance-sheet / capital-partner** models.
- Software-ish **loan OS** competitors (borrower portal + conditions) used by private lenders.

When researching, separate: **borrower acquisition messaging**, **broker channel**, **capital-partner / debt-fund diligence**, and **state licensing constraints**.

---

## Appendix A — Suggested research prompts

Copy/paste into Claude for follow-on work:

1. **Competitor messaging map:** Compare 8–12 US private money / hard money / DSCR lenders on homepage promise, rate transparency (publish vs “call for quote”), portal claims, and capital-partner language. Flag anything VFS should avoid copying that conflicts with “no invented rates / no fake NMLS.”
2. **DSCR vs hard money positioning:** How do top brands segment bridge/fix-flip vs DSCR rental products in IA and SEO? Where does “Private Money umbrella” help or confuse?
3. **Underwriting document norms:** Typical borrower package for fix-flip, bridge, ground-up, and DSCR (entity docs, liquidity, track record, SREO, GC packages). Compare to VFS soft-complete list; note gaps or over-collection risk.
4. **Fund control / draw / CFSI-style rehab norms:** Market norms for construction budgets, inspection draws, owner-builder vs GC requirements, and how consumer-facing sites explain draws without promising timelines.
5. **State licensing landscape (diligence, not legal advice):** For CA, TX, FL, AZ, NV, GA, NC, CO, WA, TN — what do peer sites disclose (NMLS, exemptions, commercial-purpose framing)? Produce a **research summary for counsel**, not a license claim for the website.
6. **Capital-partner diligence language:** How debt funds / private credit partners evaluate originators (gates, audit trail, special servicing). Suggest VFS capital-partner page improvements that stay evidence-based.
7. **SEO / content roadmap:** Prioritize glossary and guide topics that match investor search intent without requiring rate tables; call out YMYL risk around licensing claims.
8. **Conversion UX benchmarks:** Soft-complete Apply vs short Apply + later package request — what do peers do, and what metrics would Vault need to decide?

---

## Appendix B — Key code pointers

| Concern | Path |
| --- | --- |
| Solutions copy | `src/lib/marketing/solutions.ts` |
| State markets | `src/lib/marketing/states.ts` |
| Brand tokens | `src/app/globals.css` |
| Mock applications / Apply submit | `src/lib/mock/applications.ts` |
| Status labels | `src/lib/mock/status-labels.ts` |
| Portal nav / roles | `src/lib/portal/nav.ts`, `src/components/portal/PortalShell.tsx` |
| Schema | `supabase/schema.sql` |
| Types | `src/lib/types/database.ts` |
| Package model (WIP branches) | `src/lib/apply/package.ts`, `src/components/apply/*` |
| Completeness UI (WIP) | `src/components/portal/PackageCompletenessPanel.tsx` |
| Deploy gate | `.cursor/rules/vfs-deploy-gate.mdc` |

---

## Appendix C — How to use this brief with Claude

1. Paste this entire document as the **first message** (or Project Knowledge).
2. Add only: your research goal, geography focus, and any Vault-supplied facts (real metrics, licenses, rates) — otherwise Claude should assume placeholders stay unknown.
3. Ask Claude to **cite assumptions** and to **refuse inventing NMLS/rates/KPIs**; prefer competitor evidence and open questions for counsel/Vault.

---

*Generated from the VFS codebase and open draft PRs for team handoff. Update this file when `master` absorbs Apply package work or when counsel publishes licensing/legal packs.*
