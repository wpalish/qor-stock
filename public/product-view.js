// Product surfaces only. All mutations stay in app.js and the validated server API.
const node = (tag, text, cls) => {
  const e = document.createElement(tag);
  if (text !== undefined) e.textContent = text;
  if (cls) e.className = cls;
  return e;
};
const money = (value, currency = "KZT", minor = false) =>
  `${new Intl.NumberFormat("ru-RU", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(minor ? Number(value) / 100 : Number(value))} ${currency}`;
const time = (value) =>
  value
    ? new Date(value).toLocaleString("ru-RU", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Не указано";
function flag(row, labels) {
  return node(
    "span",
    row.archived ? "Архив" : labels[row.status] || row.status,
    "record-state " + (row.archived ? "archived" : row.status),
  );
}
function fact(host, label, value, cls = "") {
  const block = node("div", undefined, "fact " + cls);
  block.append(node("dt", label), node("dd", value ?? "—"));
  host.append(block);
  return block;
}
function external(label, url, cls = "text-link") {
  const a = node("a", label, cls);
  try {
    const parsed = new URL(url);
    if (!["http:", "https:"].includes(parsed.protocol)) throw Error("scheme");
    a.href = parsed.href;
    a.target = "_blank";
    a.rel = "noopener";
  } catch {
    a.removeAttribute("href");
    a.textContent = label + " · ссылка недоступна";
  }
  return a;
}
function focusRecord(host, id) {
  const target = [...host.querySelectorAll("[data-record-id]")].find(
    (e) => e.dataset.recordId === id,
  );
  target?.focus({ preventScroll: true });
}
function publicLink(row, label = "Открыть публичную форму") {
  return external(
    label,
    location.origin + "/#public=" + encodeURIComponent(row.id),
    "button secondary",
  );
}
function header(ctx, title, copy, context) {
  const { screen } = ctx;
  screen.replaceChildren();
  const heading = node("section", undefined, "workspace-heading");
  heading.setAttribute("aria-label", context);
  const titleRow = node("div", undefined, "workspace-title-row");
  titleRow.append(node("h1", title));
  heading.append(titleRow, node("p", copy, "workspace-description"));
  screen.append(heading);
  return heading;
}
function tools(ctx) {
  const {
    screen,
    config,
    active,
    user,
    button,
    input,
    create,
    refresh,
    query,
    showArchived,
    search,
    archive,
  } = ctx;
  const collection = config.collections.find((item) => item.key === active);
  const actions = node("div", undefined, "actions heading-actions");
  if (
    !collection.createDisabled &&
    (collection.writeRole !== "admin" || user.role === "admin")
  )
    actions.append(
      button(collection.addLabel || "Добавить запись", create, "primary"),
    );
  actions.append(button("Обновить", refresh));
  screen.querySelector(".workspace-title-row").append(actions);
  const toolbar = node("div", undefined, "workspace-toolbar");
  const searchBox = node("div", undefined, "search-tools");
  const queryInput = input(
    searchBox,
    "search",
    "Найти в разделе",
    query,
    "search",
    false,
  );
  queryInput.placeholder = "Название, статус или содержание";
  queryInput.addEventListener("input", () => search(queryInput.value));
  const archivedLabel = node("label", "С архивом");
  const archivedInput = node("input");
  archivedInput.type = "checkbox";
  archivedInput.checked = showArchived;
  archivedInput.addEventListener("change", () =>
    archive(archivedInput.checked),
  );
  archivedLabel.prepend(archivedInput);
  searchBox.append(archivedLabel);
  toolbar.append(searchBox);
  screen.append(toolbar);
  const host = node("section");
  host.id = "records";
  host.setAttribute("aria-label", "Рабочие записи");
  screen.append(host);
}
function empty(ctx, description, dependency) {
  const {
    host,
    values,
    state,
    active,
    query,
    button,
    clear,
    create,
    user,
    config,
    navigate,
  } = ctx;
  if (values.length) return false;
  const c = config.collections.find((x) => x.key === active),
    hasRecords = state.data[active].length > 0;
  const box = node("section", undefined, "empty-records");
  box.append(
    node(
      "h2",
      hasRecords
        ? query
          ? "Ничего не найдено"
          : "Здесь только архивные записи"
        : "Начните с первой записи",
    ),
    node(
      "p",
      hasRecords
        ? "Измените поиск или покажите архив. Сохранённая история остаётся доступной."
        : description,
    ),
  );
  if (hasRecords) box.append(button("Сбросить поиск и показать архив", clear));
  else if (dependency)
    box.append(
      button(dependency.label, () => navigate(dependency.key), "primary"),
    );
  else if (
    !c.createDisabled &&
    (c.writeRole !== "admin" || user.role === "admin")
  )
    box.append(button(c.addLabel || "Добавить запись", create, "primary"));
  else
    box.append(
      node(
        "p",
        c.createDisabled
          ? "Ответы появляются только после отправки публичной формы."
          : "Записи в этом разделе подготавливает администратор.",
        "muted",
      ),
    );
  host.append(box);
  return true;
}
function count(ctx) {
  const toolbar = ctx.host.previousElementSibling;
  let counter = toolbar.querySelector(".record-count");
  if (!counter) {
    counter = node("p", undefined, "record-count");
    counter.setAttribute("role", "status");
    counter.setAttribute("aria-live", "polite");
    toolbar.append(counter);
  }
  counter.textContent = `Показано ${ctx.values.length} из ${ctx.state.data[ctx.active].length}`;
}
function editorLayout(screen, form, aside) {
  const layout = node("div", undefined, "editor-layout");
  form.before(layout);
  layout.append(form, aside);
  return layout;
}
function note(title, text, cls = "context-note") {
  const e = node("aside", undefined, cls);
  e.append(node("h2", title), node("p", text));
  return e;
}
function publicLayout({ screen, form, E }, eyebrow, help) {
  const intro = node("section", undefined, "public-intro"),
    title = screen.querySelector(":scope > h1"),
    description = title.nextElementSibling;
  title.before(intro);
  intro.append(node("p", eyebrow, "eyebrow"), title, description);
  document.getElementById("identity").textContent = "Публичная форма";
  const aside = note("Перед отправкой", help);
  const layout = node("div", undefined, "public-layout");
  form.before(layout);
  layout.append(form, aside);
}
const catalogStates = { draft: "Черновик", published: "Опубликован" };
const checkStates = {
  new: "Новый",
  reviewed: "Проверен сотрудником",
  closed: "Закрыт",
};
export function freshness(row, now = Date.now()) {
  const checked = Date.parse(row.checkedAt),
    until = checked + Number(row.validHours) * 3600000;
  if (!Number.isFinite(checked) || !Number.isFinite(until))
    return { kind: "unknown", label: "Нет корректной проверки", until: null };
  if (checked > now)
    return { kind: "future", label: "Время проверки в будущем", until };
  if (now >= until)
    return { kind: "stale", label: "Нужна повторная проверка", until };
  return { kind: "fresh", label: "Сведения свежие", until };
}
function evidence(row) {
  const value = freshness(row),
    box = node("div", undefined, "freshness " + value.kind);
  box.append(
    node("strong", value.label),
    node("span", `Проверено: ${time(row.checkedAt)}`),
    node(
      "span",
      `Свежесть до: ${value.until ? time(value.until) : "не определена"}`,
    ),
  );
  return box;
}
export function renderWorkspace(ctx) {
  const content = {
    items: [
      "Наличие под контролем",
      "Остаток и цена по источнику. Свежесть сведений — не срок годности товара.",
      "QorStock / Реестр наличия",
    ],
    zones: [
      "Условия доставки",
      "Тариф, минимум и ориентир доставки по отдельно проверенному источнику.",
      "QorStock / Маршруты доставки",
    ],
    checks: [
      "Запросы на проверку",
      "Сохранённые ответы по снимку товара и доставки на момент запроса.",
      "QorStock / Разбор запросов",
    ],
  }[ctx.active];
  header(ctx, ...content);
  tools(ctx);
}
export function renderProductRecords(ctx) {
  const { host, values, active, button, edit, state } = ctx;
  host.replaceChildren();
  count(ctx);
  const missing =
    active === "checks"
      ? !state.data.items.some((x) => !x.archived && x.status === "published")
        ? { key: "items", label: "Подготовить товар" }
        : !state.data.zones.some((x) => !x.archived && x.status === "published")
          ? { key: "zones", label: "Подготовить доставку" }
          : null
      : null;
  if (
    empty(
      ctx,
      active === "items"
        ? "Добавьте SKU, вариант, остаток и подтверждающий источник. Отметьте время и срок свежести проверки."
        : active === "zones"
          ? "Добавьте зону, стоимость, минимум и проверенный источник условий доставки."
          : "Проверьте опубликованный товар, зону и количество. Сервер сохранит оценку либо причины ручного уточнения.",
      missing,
    )
  )
    return;
  if (active === "items") {
    const intro = node("div", undefined, "ledger-note");
    intro.append(
      node("strong", "Ручной учёт сведений"),
      node(
        "p",
        "Запрос не резервирует и не списывает остаток. Свежесть на экране определяется по часам устройства; окончательную проверку выполняет сервер.",
      ),
    );
    const ledger = node("div", undefined, "stock-ledger"),
      heading = node("div", undefined, "ledger-head");
    for (const text of [
      "Товар / артикул",
      "Остаток и цена",
      "Проверка источника",
      "Действия",
    ])
      heading.append(node("span", text));
    ledger.append(heading);
    const sorted = [...values].sort(
      (a, b) =>
        Number(freshness(a).kind === "fresh") -
        Number(freshness(b).kind === "fresh"),
    );
    for (const row of sorted) {
      const record = node("article", undefined, "stock-record"),
        identity = node("div", undefined, "stock-identity"),
        quantity = node("div", undefined, "stock-quantity"),
        source = node("div", undefined, "stock-source"),
        actions = node("div", undefined, "actions");
      identity.append(
        node("p", row.sku, "sku"),
        node("h2", row.name),
        node("p", row.variant),
        flag(row, catalogStates),
      );
      quantity.append(
        node("span", "По сохранённой записи", "muted"),
        node(
          "strong",
          `${row.stock} шт.`,
          row.stock === 0 ? "out-of-stock" : "",
        ),
        node("span", money(row.price)),
      );
      source.append(evidence(row), external("Открыть источник", row.source));
      actions.append(button("Обновить сведения", () => edit(row)));
      if (row.status === "published" && !row.archived)
        actions.append(publicLink(row, "Публичная проверка"));
      record.append(identity, quantity, source, actions);
      ledger.append(record);
    }
    host.append(ledger, intro);
    return;
  }
  if (active === "zones") {
    const routes = node("div", undefined, "delivery-ledger");
    for (const row of values) {
      const route = node("article", undefined, "delivery-route"),
        top = node("div", undefined, "route-title");
      top.append(node("h2", row.name), flag(row, catalogStates));
      const dl = node("dl", undefined, "delivery-facts");
      fact(dl, "Доставка", money(row.fee));
      fact(dl, "Минимум товаров", money(row.minimum));
      fact(dl, "Ориентир", `${row.days} дн.`);
      const source = node("div", undefined, "route-source");
      source.append(
        evidence(row),
        external("Источник условий", row.source),
        button("Открыть зону", () => edit(row)),
      );
      route.append(top, dl, source);
      routes.append(route);
    }
    host.append(routes);
    return;
  }
  const queue = node("div", undefined, "check-ledger");
  for (const row of values) {
    const doc = node("article", undefined, "check-record"),
      s = row.snapshot,
      result = row.result,
      heading = node("div", undefined, "check-heading");
    heading.append(node("p", row.id, "sku"), flag(row, checkStates));
    doc.append(
      heading,
      node("h2", `${s.item.name} · ${s.item.variant}`),
      node("p", `${row.quantity} шт. → ${s.zone.name}`, "check-path"),
    );
    const outcome = node("section", undefined, "check-outcome " + result.kind);
    outcome.append(
      node(
        "h3",
        result.kind === "estimate"
          ? "Предварительная оценка"
          : "Нужна проверка оператора",
      ),
    );
    if (result.kind === "estimate") {
      const dl = node("dl", undefined, "result-facts");
      fact(dl, "Товары", money(result.subtotal, "KZT", true));
      fact(dl, "Доставка", money(result.fee, "KZT", true));
      fact(dl, "Итог", money(result.total, "KZT", true));
      outcome.append(dl);
    } else {
      const reasons = node("ul");
      for (const reason of result.reasons) reasons.append(node("li", reason));
      outcome.append(reasons, node("p", "Итоговая сумма не обещана."));
    }
    doc.append(outcome);
    const snapshot = node("details", undefined, "saved-evidence");
    snapshot.append(node("summary", "Источники на момент запроса"));
    const dl = node("dl", undefined, "snapshot-facts");
    fact(dl, "Снимок", time(s.at));
    fact(dl, "Артикул", s.item.sku);
    fact(dl, "Остаток в снимке", `${s.item.stock} шт.`);
    fact(dl, "Цена в снимке", money(s.item.price));
    fact(
      dl,
      "Товар проверен",
      `${time(s.item.checkedAt)} · ${s.item.validHours} ч.`,
    );
    fact(
      dl,
      "Доставка проверена",
      `${time(s.zone.checkedAt)} · ${s.zone.validHours} ч.`,
    );
    fact(dl, "Минимум зоны", money(s.zone.minimum));
    fact(dl, "Ориентир доставки", `${s.zone.days} дн.`);
    snapshot.append(
      dl,
      external("Источник товара", s.item.source),
      external("Источник доставки", s.zone.source),
    );
    doc.append(snapshot);
    if (row.note)
      doc.append(node("p", row.note, "operator-note preserve-lines"));
    doc.append(
      node(
        "p",
        "Остаток не зарезервирован. Запрос не является заказом.",
        "context-line",
      ),
      button("Открыть обработку", () => edit(row), "primary"),
    );
    queue.append(doc);
  }
  host.append(queue);
}
export function decorateEditor({ screen, form, c, row, state }) {
  if (c.key === "items" || c.key === "zones") {
    const aside = note(
        "Сведения должны иметь источник",
        "Сохраните время фактической проверки и срок свежести от 1 до 168 часов. Срок относится к данным, а не к годности товара.",
        "source-preview",
      ),
      preview = node("div", undefined, "evidence-preview");
    aside.append(preview);
    const update = () => {
      const values = new FormData(form),
        local = values.get("checkedAt__local"),
        zone = values.get("checkedAt__zone"),
        sample = {
          checkedAt: local ? `${local}:00${zone}` : "",
          validHours: values.get("validHours"),
        };
      preview.replaceChildren(evidence(sample));
      if (c.key === "items")
        preview.append(
          node("p", `Остаток по записи: ${values.get("stock") || "0"} шт.`),
        );
      const url = values.get("source");
      if (url) preview.append(external("Проверить указанный источник", url));
    };
    form.addEventListener("input", update);
    form.addEventListener("change", update);
    update();
    aside.append(
      node(
        "p",
        "Только публикация открывает источник для новых запросов. Сервер проверяет время и остальные ограничения перед сохранением.",
        "context-line",
      ),
    );
    editorLayout(screen, form, aside);
  } else if (row) {
    const aside = note(
      "Исходный ответ сохранён",
      row.result.kind === "estimate"
        ? `Предварительно ${money(row.result.total, "KZT", true)}. Сумма и исходные сведения неизменны.`
        : "Сумма не определена: требуется ручная проверка. Исходные причины сохраняются.",
      "source-preview",
    );
    for (const reason of row.result.reasons) aside.append(node("p", reason));
    aside.append(
      node("p", `${row.quantity} шт. · ${row.snapshot.zone.name}`),
      node(
        "p",
        "Статус сотрудника не резервирует товар и не подтверждает доставку.",
      ),
    );
    editorLayout(screen, form, aside);
  } else {
    editorLayout(
      screen,
      form,
      note(
        "Проверка по двум источникам",
        "Выберите опубликованный товар и зону доставки. Новый запрос начинает обработку со статуса «Новый». При устаревших сведениях, недостатке остатка или минимальной суммы сервер сохранит причины ручной проверки.",
      ),
    );
  }
}
export function decoratePublic(ctx) {
  publicLayout(
    ctx,
    "QorStock / Проверка наличия",
    "Укажите количество и зону доставки. Свежие сведения и достаточный остаток дадут предварительную сумму. Иначе сохранится запрос для ручной проверки без обещанной суммы.",
  );
}

// Fragment navigation and request generations are shared by initial load and browser history.
export function parseHashRoute(hash, collectionKeys) {
  const params = new URLSearchParams(hash.replace(/^#/, ""));
  if (params.has("public")) return { kind: "public", id: params.get("public") };
  const section = params.get("section");
  return {
    kind: "workspace",
    section: collectionKeys.includes(section) ? section : null,
  };
}
export function createRouteGuard() {
  let current = 0;
  return {
    next: () => ++current,
    current: () => current,
    isCurrent: (ticket) => ticket === current,
  };
}
