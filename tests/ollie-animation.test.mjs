import assert from "node:assert/strict";
import test from "node:test";
import sharp from "sharp";
import { ollieFrames } from "../src/lib/ollie-animation.ts";

test("plays every frame of all nine standard animations", () => {
  const counts = [6, 8, 8, 4, 5, 8, 6, 6, 6];
  for (const [row, count] of counts.entries()) {
    const columns = new Set(
      ollieFrames
        .filter((frame) => frame.row === row)
        .map((frame) => frame.column),
    );
    assert.deepEqual(
      [...columns].sort(),
      Array.from({ length: count }, (_, i) => i),
    );
  }
});

test("looks around all sixteen directions in clockwise order", () => {
  const frames = ollieFrames.filter(
    (frame) => frame.animation === "look-around",
  );
  assert.deepEqual(
    frames.map(({ row, column }) => [row, column]),
    Array.from({ length: 16 }, (_, i) => [9 + Math.floor(i / 8), i % 8]),
  );
});

test("every referenced frame contains artwork inside the correct cell", async () => {
  const { data, info } = await sharp(
    new URL("../src/assets/ollie/spritesheet.webp", import.meta.url).pathname,
  )
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  assert.equal(info.width, 768);
  assert.equal(info.height, 1144);
  for (const key of new Set(
    ollieFrames.map(({ row, column }) => `${row}:${column}`),
  )) {
    const [row, column] = key.split(":").map(Number);
    let visible = 0;
    for (let y = row * 104; y < (row + 1) * 104; y++) {
      for (let x = column * 96; x < (column + 1) * 96; x++) {
        if (data[(y * info.width + x) * info.channels + 3] > 0) visible++;
      }
    }
    assert.ok(
      visible > 500,
      `Frame ${key} must contain a complete visible sprite`,
    );
  }
});
