# QorStock · pre-release candidate

26 October 2026. Implemented and locally verified for the scoped workflows below. Draft PR only; no merge or deployment. This is a local candidate for review, with operational release checks still required.

## Product changes

Остаток, цена и срок свежести источника в одной строке; отдельные условия доставки и сохранённые основания ответа. Исправлены публичная навигация и запоздалые ответы загрузки.

Design direction: **Реестр наличия с доказательствами свежести**. Current visual decisions and tokens are in DESIGN.md. Actions share the heading, search/archive/count share a toolbar, and workflow help follows primary records. UI uses actual saved data.

## Verified

- Node 24.19.0 full suite: **19/19 passed**, zero failed/skipped/cancelled; JavaScript syntax and whitespace checks passed.
- Browser: Свежие сведения дали 2×18 900+1 500 = 39 300 KZT. Устаревший источник создал запрос оператору без итоговой суммы. В браузере проверены смена товара, Назад/Вперёд и возврат в закрытые запросы.
- Captured and inspected at 390×844, 768×1024 and 1440×1000. No page-level horizontal overflow on the captured working screens. Visible button/input/select/summary targets measured at least44px high (native check/radio controls are checked through their labelled hit areas).
- Visible keyboard focus and no-result search/reset were checked in the nine server workspaces. Computed text contrast on captured primary screens met4.5:1 for normal /3:1 for large text; this is a scoped check, not a complete accessibility certification.
- New browser modules load through an exact static allowlist. Existing domain, role, CSRF, origin, revision, persistence and restore suites remain passing. Stale commands return **HTTP400**, not409.

Evidence is in the parent task's outputs/pre-release/evidence/qor-stock/, test log and machine-readable checks. Browser fixtures use synthetic data; HTTP fixture checks and UI checks are recorded separately. No external operational outcome is inferred.

## Remaining release checks

Свежесть относится к сведениям, а не к сроку годности товара. Нет резерва, заказа, оплаты и подключения к складу.

Before a real pilot: configure and verify production HTTPS/origin/session cookie settings, hosting/restart behavior, backup and restore on the actual host, account/access procedures and retention. Screen-reader testing, real-device touch/zoom, OS reduced-motion emulation, initial-network-failure injection and load testing were not performed in this increment. For the browser-only SabaqLoop, validate browser storage/export and device policy instead of server deployment settings. Existing limits in README.md and PRODUCT.md apply.

## Design review

Apple-design, frontend-ui-engineering, Impeccable and interface-polish guidance informed this increment. The mechanical style detector produced suggestions for redundant side stripes and warm palettes. Stripes in the server workspaces were thinned/removed; three deliberate product palettes were retained after contrast checks. The detector output is preserved; it is not reported as a zero-warning scan. No new dependency or external service is required.
