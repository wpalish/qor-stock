---
name: QorStock
description: An inherited Startup Lab Operate interface for checking manually maintained stock and delivery information.
colors:
  ground: "#edf3f8"
  foreground: "#172e45"
  navy: "#183e60"
  teal: "#126653"
  teal-hover: "#0b5343"
  amber: "#795200"
  surface: "#fff"
  navigation-ground: "#dce9f3"
  line: "#b9cbd9"
  field-line: "#7894aa"
  link: "#174e7e"
  muted: "#46627a"
  error: "#942721"
  error-ground: "#fff0ee"
  selection-ground: "#b7ded2"
  selection-foreground: "#132f29"
  focus: "#bd671a"
typography:
  headline:
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    fontSize: "clamp(1.7rem, 4vw, 2.5rem)"
    lineHeight: 1.15
    letterSpacing: "-0.025em"
  title:
    fontSize: "1.3rem"
  body:
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    lineHeight: 1.6
  label:
    fontWeight: 600
  brand:
    fontSize: "1.4rem"
    fontWeight: 740
  muted:
    fontSize: "0.9rem"
  code:
    fontSize: "0.85rem"
rounded:
  control: "7px"
  panel: "12px"
spacing:
  small: "0.5rem"
  actions: "0.6rem"
  control: "0.7rem"
  base: "1rem"
  gutter: "1.25rem"
  panel: "1.4rem"
  section: "2rem"
components:
  button-primary:
    backgroundColor: "{colors.teal}"
    textColor: "{colors.surface}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "0.65rem 1rem"
  button-primary-hover:
    backgroundColor: "{colors.teal-hover}"
    textColor: "{colors.surface}"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.navy}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "0.65rem 1rem"
  field:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.control}"
    padding: "{spacing.control}"
    width: "100%"
  panel:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.panel}"
    padding: "{spacing.panel}"
  navigation-current:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.navy}"
    rounded: "{rounded.control}"
    padding: "0.65rem 1rem"
  error-notice:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.error}"
    rounded: "{rounded.control}"
    padding: "{spacing.base}"
---

# Design System: QorStock

## Overview

**Creative North Star: "Startup Lab Operate"**

QorStock inherits the existing Startup Lab working-cabinet family. The interface presents a light workspace, a blue header and navigation, labelled forms, readable tables and a separate checking result. This document records the implementation in `public/styles.css`, `public/app.js` and `public/index.html`; it establishes no new visual world, approved composition or comparative quality ceiling.

The operating character is restrained and factual. Source names, requested quantity, freshness information and the saved result carry the visual hierarchy. A preliminary estimate and a request for manual checking remain visibly distinct through their headings and text, including the absence of amounts when checking is required. This is visual documentation of the bounded product in `PRODUCT.md`, not an external security or customer-readiness assessment.

**Key Characteristics:**

- Cool light ground with white, bordered working surfaces.
- System sans typography and tabular numerals in data tables.
- Teal primary actions, blue secondary actions and visible keyboard focus.
- Textual outcomes with a readable source snapshot and explicit limitations.

## Colors

The palette separates blue structure, teal actions and cool neutral data surfaces. The frontmatter preserves the CSS source values; the sidecar contains supplemental display ramps, not additional application colors.

### Primary

- **Operate Blue** (`navy`): header, secondary-action text and borders, and navigation text.
- **Action Teal** (`teal`, `teal-hover`): primary and submit actions. Hover also retains the shared brightness filter; the hover swatch alone is not the final composited color.

### Secondary

- **Pending Amber** (`amber`): available to the CSS pending-text treatment. The current QorStock app does not assign this treatment to its request rows. It is not the focus-ring color.
- **Focus Copper** (`focus`): the global keyboard-focus outline.
- **Source Blue** (`link`): source links and input carets.

### Neutral

- **Cool Workspace** (`ground`) and **White Surface** (`surface`): page ground and working panels.
- **Ink Navy** (`foreground`) and **Muted Slate** (`muted`): normal and supporting copy.
- **Navigation Mist** (`navigation-ground`): navigation strip and table headings.
- **Panel Line** (`line`) and **Field Line** (`field-line`): structural dividers and stronger field boundaries. Field Line also colors thin scrollbars against the workspace ground.
- **Error Red** (`error`) over **Error Wash** (`error-ground`): feedback when an operation fails.
- **Selection Mint** (`selection-ground`) and **Selection Ink** (`selection-foreground`): selected text.

**The Text Carries State Rule.** Keep outcome, archive and processing labels readable in text; the implementation does not rely on colored status chips.

## Typography

The root uses the platform sans stack in `typography.body`; there is no downloaded display font. The CSS leaves root/body font size and general body line-height to browser defaults. The body token's line-height applies to paragraphs, not every control. Do not turn a browser-default size into a claimed authored token.

- **Headline:** responsive page/result heading using `typography.headline`, with bottom margin (0.8rem). Its weight is the browser's heading default rather than an explicit project weight.
- **Title:** section heading using `typography.title`, with margins (2rem 0 0.75rem).
- **Body:** paragraphs use line-height (1.6), maximum measure (72ch) and margins (0.5rem 0 1rem).
- **Label:** visible form labels use weight (600), top margin (1rem) and bottom margin (0.35rem); the first label has no top margin. Buttons share this weight.
- **Brand:** compact wordmark text uses `typography.brand` and removes the link underline.
- **Supporting text:** muted copy, footer and table headings use size (0.9rem). Small elements use line-height (1.5); raw snapshot text uses `typography.code`, wrapping whitespace and long strings.
- **Data:** tables and date inputs use tabular numerals. Table numerals retain the platform sans; there is no separate numeric font.

## Layout

The shell is a full-width header and navigation strip above a centered main region. Main has maximum width (1200px), padding (2rem 1.25rem), automatic inline margins and minimum height (75vh). Header padding is (1.1rem max(1.25rem, calc((100% - 1160px) / 2))); navigation uses the same horizontal calculation with vertical padding (0.7rem). Header content is a flex row with a gap (1rem), aligned centrally and spaced apart.

The operating list reads vertically: page heading and explanatory text, actions, search/archive controls, a records table, then calculation/control summaries. Search uses columns (minmax(200px, 500px) auto), gap (0.5rem 1.2rem) and a full-width label. Forms are single vertical sequences of explicit labels and controls; the public form and receipt do not use a desktop sidebar. Login alone caps its form at (480px). The stylesheet also exposes a two-column working layout (minmax(0, 1fr) minmax(260px, 0.8fr)), gap (2rem), and a two-column form row, but the current QorStock renderer does not instantiate either helper.

At viewport widths at or below (700px), main padding becomes (1.4rem 1rem), panel padding becomes (1rem), header content aligns to the top, and the identity text uses size (0.8rem) with maximum width (140px). Navigation wraps with padding (0.6rem); buttons have maximum width (100%). The unused working/row helpers collapse to one column, with working gap (1.2rem).

At widths at or below (600px), search becomes one column, navigation buttons use automatic flex sizing, table text becomes (0.9rem), and each table cell has minimum width (140px). Preserve horizontal scrolling inside the table container rather than compressing the columns into illegibility. A visible narrow-screen hint explains that further columns/actions are to the right. Table cells otherwise have maximum width (28ch) and allow long text to wrap.

Reviewed saved evidence includes desktop public/operator captures and a public-entry capture at (390 CSS px, DPR 2). A saved keyboard submission reached the manual-check result at width/scrollWidth (390px); that proof predates the quantity/focus fixes. The operator cabinet has no verified mobile journey in this documentation pass. Full evidence limits are recorded in `.impeccable/surfaces/public-check.md`.

## Elevation & Depth

There are no authored shadows, gradients, overlays, backdrop filters or animation transitions. Depth comes from the cool ground, white working surfaces, blue structural bands and thin borders. The hover feedback is immediate: buttons apply `filter: brightness(1.13)`; primary buttons additionally change their background to `teal-hover`. Preserve this source behavior without inventing a movement or elevation system.

**The Flat Workspace Rule.** Use borders and surface tone to group operating content; do not introduce an unapproved decorative material system.

## Shapes

Controls and notices use the control radius; panels and table containers use the larger panel radius. Panels have a solid border (1px), padding from the panel token, and minimum width (0). The table container retains its own rounded boundary and scroll area. Table cells have solid bottom separators (1px), padding (0.9rem), top alignment and left-aligned text; the final row omits its bottom separator. This is a table/form language, without ornamental imagery or a pill-chip system.

## Components

### Buttons

Primary actions use the teal variant; secondary actions are white with blue text and a blue border. Both use border (1px), control radius, padding (0.65rem 1rem), minimum height (44px) and weight (600). Action groups wrap with gap (0.6rem) and top margin (1rem). The CSS also has a blue base-button style, but the renderer's ordinary helper defaults to the secondary variant.

All buttons brighten on hover; primary buttons additionally use the darker teal source background. Disabled buttons use opacity (0.55) and a wait cursor. The application disables the triggering button during an asynchronous operation and reenables it afterward; there is no spinner or authored active-state animation.

### Inputs / Fields

Inputs, selects and textareas fill their parent width, use padding (0.7rem), a stronger solid border (1px), white background, inherited text color and the control radius. Inputs and selects inherit the root font. Textareas have minimum height (100px) and vertical resizing. Labels are explicitly associated with controls. The public form uses a required integer quantity and a required delivery-zone select, including a blank selection prompt.

Saved request item/zone selects are disabled and quantity is read-only. Their label values come from the saved snapshot, preserving historical identity after source edits. The CSS supplies no custom read-only/disabled field palette; retain the native distinction rather than claiming an authored variant.

### Navigation

The light blue strip contains collection buttons plus data/access and sign-out actions. Generated navigation buttons carry the secondary class, so the actual cascade gives them white surfaces, including inactive buttons. The active collection is marked with `aria-current="page"` and the structural-line border; inactive navigation borders are transparent. Navigation wraps at the documented breakpoints. The public flow clears navigation buttons but retains the empty strip's background and spacing.

### Panels / Tables

Panels contain forms or a source-check section; they are white, outlined and flat. The records table presents the first five configured fields plus an action column. The container is keyboard-focusable and labelled with a scrolling instruction. The empty state uses muted explanatory text instead of an empty table. Archived rows append an explicit archive label and remain discoverable through the archive toggle.

### Notices / Focus

The shell's notice region has polite live-status semantics and is programmatically focusable. Empty notices are hidden. Nonempty notices use a white bordered container; error feedback uses red text and wash. Because the later nonempty-notice selector supplies its background and border, actual errors inside that shared notice region retain the white notice background, while the error text color remains red. The red wash is the standalone error-class treatment, not a guaranteed shell-notice background.

Global keyboard focus uses outline (3px solid) in Focus Copper with offset (3px). The skip link is positioned above the viewport until focus moves it to top (1rem), with left offset (1rem) and stacking level (5). There is no separate focus glow.

### Public Checking Result

The result is a plain document flow on the workspace ground, not a confirmation card or checkout. The main heading states either preliminary estimate or manual checking, followed by request number and requested quantity. Estimate results show the saved KZT total and quantity × unit price, subtotal and delivery fee. Manual-check results show their reasons without total or arithmetic amounts. Both show the source-check section, product identity, freshness timestamps, delivery orientation, source links, limitation text and a repeat-check action.

After a successful public submission, the renderer makes the new result heading programmatically focusable (`tabIndex=-1`) and focuses it after appending the result. Source links open separately with `rel="noopener"`. The saved quantity, arithmetic and snapshot names remain the authority for historical display. The saved review verdict resolves these three scoped fixes; it does not certify every product surface.

## Do's and Don'ts

### Do:

- **Do** preserve the inherited Startup Lab Operate palette, platform typography, visible labels and flat table/form language.
- **Do** keep preliminary amounts, requested quantity, source identity and freshness information in the reading order.
- **Do** retain a total-free manual-check outcome and the explicit non-reservation, non-order and delivery-limit wording.
- **Do** preserve keyboard focus, the notice region and horizontally scrollable tables with a narrow-screen hint.
- **Do** distinguish current source names from saved snapshot names in every historical display.

### Don't:

- **Don't** present an estimate or operator request as an order, reservation, payment, inventory deduction or promised delivery.
- **Don't** replace explicit state labels with color-only signals or invented decorative metrics.
- **Don't** use Pending Amber as the focus color; preserve the actual global focus treatment.
- **Don't** add shadows, animated movement, new fonts or a new visual world without a separately authorized change.
- **Don't** interpret the saved public mobile evidence or the scoped finish verdict as verification of every mobile journey, production security or customer readiness.
