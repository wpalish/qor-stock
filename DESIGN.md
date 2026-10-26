# QorStock design system · 26 October 2026

## Product direction: Evidence ledger

A practical, source-led availability ledger. Product identity, saved quantity, price and evidence freshness share each row. Delivery evidence and saved request outcomes have their own compositions.

Deep spruce shell, pale mineral ground, square ledger rules and utility monospace headings/numbers. Horizontal navigation stays in the dark header band.

Semantic palette: `#18332c` text · `#52645e` supporting text · `#f3f5ef` ground · `#ffffff` records · `#265d3c` action.

This increment supersedes the earlier inherited blue-table surface specification. It uses the approved quality direction as a craft bar; composition, navigation and typography are specific to this product. No remote font, icon library, imagery, ornamental SVG, chart or paid dependency was added.

## Implemented composition and domain truth

- The item ledger exposes SKU/name/variant, saved stock/price, publication state, checked time, freshness deadline, source and real edit/public actions. Stale evidence is listed first.
- `checkedAt + validHours` defines evidence freshness, with exact-boundary expiry and explicit future/invalid states. This is freshness of information, not goods expiry. There is no batch model, stock reservation, automatic movement or stock decrement.
- Delivery uses route rows with fee, minimum goods amount, days and its independent checked source. The source editor previews freshness from entered timestamp/timezone/validity.
- Requests show actual server `estimate` or `operator` outcomes. Operator results never show a promised total. Estimate totals/subtotal/fee come from saved server results; snapshots retain original SKU, stock, price and both checked sources.
- The public quantity/zone form and receipt remain the existing flow. Display freshness uses the device clock; the server decides each request. Refresh reloads current records and recomputes the visible freshness.

## Controls, states and responsive contract

`public/product-view.js` owns product presentation. `public/app.js` continues to own authenticated loading, CSRF/revision-checked commands, native validation, immutable-field preservation, archive, public endpoints, staff access and backup/audit settings. All record content is inserted as text. External source links accept only HTTP(S).

Search covers stored content and resolved field labels. The archive toggle and explicit reset preserve access to history. Primary creation controls respect the configured collection role/create restriction. Empty and no-result states give a concrete recovery action. Server errors remain in a live notice that receives focus; pending controls are disabled with `aria-busy`.

Controls and public actions have a 44px minimum target. Native fields retain visible labels; checkbox labels include the target. Headings use size-dependent tracking; body copy retains relaxed leading. Focus outlines are explicit. Record-selection controls preserve keyboard focus, and editor/navigation transitions focus the new heading. Responsive rules adapt the layout for 390px/768px/1440px without removing the primary action. Motion is limited to immediate press feedback with a reduced-motion fallback. This is a light design; no dark-mode acceptance is claimed.

## Verification boundary

Node 24.19.0 syntax checks passed for both changed JavaScript files. Existing domain/server tests plus any added presentation-logic regression passed: **19/19**. These checks do not establish visual or browser acceptance. Actual screenshots, keyboard/touch behavior, focus, console and responsive overflow require the parent browser QA pass recorded in [PRE_RELEASE.md](PRE_RELEASE.md). Earlier screenshots describe the previous surface.

## Desktop craft pass · captured evidence

The actual 1440×1000 desktop capture exposed an oversized vertical scaffold before the first working record. This pass puts the title and primary actions in one row, uses one concise supporting sentence, and combines the visible search label, search field, archive toggle and live record count in a single control rail. The product context remains an accessible section label, without repeating the brand above every title. At small widths, title/actions and labelled search controls wrap deliberately. Control hit areas remain at least 44px.

The stock ledger uses tighter identity/source spacing and ruled rows; the detailed manual-data/clock explanation follows the ledger. Timestamp, source, quantity and both action targets remain visible in each row. This raises the amount of working inventory visible before scrolling.

The source applies optical heading tracking, antialiasing and tabular count/money figures. No decorative motion or new assets were added. The original screenshots were inspected; refreshed screenshots and responsive measurements belong to parent browser QA and are not yet claimed for this pass.
