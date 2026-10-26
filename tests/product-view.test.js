import test from "node:test";
import assert from "node:assert/strict";
import { freshness } from "../public/product-view.js";
const checkedAt = "2026-10-26T10:00:00+05:00";
const checked = Date.parse(checkedAt);
test("visible evidence freshness includes check instant and expires exactly at its boundary", () => {
  assert.equal(freshness({ checkedAt, validHours: 2 }, checked).kind, "fresh");
  assert.equal(
    freshness({ checkedAt, validHours: 2 }, checked + 7200000 - 1).kind,
    "fresh",
  );
  const expired = freshness({ checkedAt, validHours: 2 }, checked + 7200000);
  assert.equal(expired.kind, "stale");
  assert.equal(expired.until, checked + 7200000);
});
test("future and invalid evidence never receives the fresh label", () => {
  assert.equal(
    freshness({ checkedAt, validHours: 2 }, checked - 1).kind,
    "future",
  );
  assert.equal(
    freshness({ checkedAt: "invalid", validHours: 2 }, checked).kind,
    "unknown",
  );
});
