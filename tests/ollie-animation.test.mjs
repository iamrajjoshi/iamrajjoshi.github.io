import assert from "node:assert/strict";
import test from "node:test";
import sharp from "sharp";
import {
  createOllieBehavior,
  ollieFrames,
  REACTION_COOLDOWN_MS,
  REST_AFTER_MS,
} from "../src/lib/ollie-animation.ts";

const frameKey = ({ row, column }) => `${row}:${column}`;

function sampleFrames(behavior, start, end) {
  const frames = [];
  for (let now = start; now < end;) {
    const sample = behavior.sample(now);
    assert.ok(Number.isFinite(sample.delay) && sample.delay > 0);
    frames.push(sample.frame);
    now += Math.max(1, sample.delay);
  }
  return frames;
}

function finishReaction(behavior, start) {
  const frames = [];
  for (let now = start; now < start + 10_000;) {
    const sample = behavior.sample(now);
    if (sample.mood !== "reacting") {
      assert.equal(sample.mood, "idle");
      return { end: now, frames };
    }
    assert.ok(Number.isFinite(sample.delay) && sample.delay > 0);
    frames.push(sample.frame);
    now += Math.max(1, sample.delay);
  }
  assert.fail("A click reaction must settle within ten seconds");
}

test("plays every frame of all nine standard animations", () => {
  const counts = [6, 8, 8, 4, 5, 8, 6, 6, 6];
  for (const [row, count] of counts.entries()) {
    const columns = new Set(
      ollieFrames
        .filter((frame) => frame.row === row)
        .map((frame) => frame.column),
    );
    for (let column = 0; column < count; column++) {
      assert.ok(columns.has(column), `Standard frame ${row}:${column} is used`);
    }
  }
});

test("looks around all sixteen directions in clockwise order", () => {
  const frames = ollieFrames.filter(
    (frame) => frame.animation === "look-around",
  );
  assert.deepEqual(
    frames.slice(0, 16).map(({ row, column }) => [row, column]),
    Array.from({ length: 16 }, (_, i) => [9 + Math.floor(i / 8), i % 8]),
  );
});

test("Ollie starts calm and rests after twenty quiet seconds", () => {
  assert.equal(REST_AFTER_MS, 20_000);
  const start = 1_000_000;
  const behavior = createOllieBehavior(start);
  assert.equal(behavior.sample(start).mood, "idle");
  assert.equal(behavior.sample(start + REST_AFTER_MS - 1).mood, "idle");
  assert.equal(behavior.sample(start + REST_AFTER_MS).mood, "resting");
});

test("unprompted routines stay calm instead of launching click reactions", () => {
  const behavior = createOllieBehavior(0);
  const frames = sampleFrames(behavior, 0, REST_AFTER_MS + 60_000);
  const calmAnimations = new Set(["idle", "waiting", "failed"]);
  assert.ok(frames.every((frame) => calmAnimations.has(frame.animation)));
});

test("a click wakes Ollie immediately, then he settles and rests again", () => {
  const behavior = createOllieBehavior(0);
  const clickedAt = REST_AFTER_MS + 5_000;
  assert.equal(behavior.sample(clickedAt).mood, "resting");
  assert.equal(behavior.react(clickedAt), true);
  assert.equal(behavior.sample(clickedAt).mood, "reacting");
  const { end } = finishReaction(behavior, clickedAt);
  assert.equal(behavior.sample(end + REST_AFTER_MS - 1).mood, "idle");
  assert.equal(behavior.sample(end + REST_AFTER_MS).mood, "resting");
});

test("rapid clicks are coalesced without altering or queuing the reaction", () => {
  assert.equal(REACTION_COOLDOWN_MS, 750);
  const behavior = createOllieBehavior(0);
  const reference = createOllieBehavior(0);
  assert.equal(behavior.react(0), true);
  reference.react(0);
  for (const now of [1, 50, 200, REACTION_COOLDOWN_MS - 1]) {
    assert.equal(behavior.react(now), false);
    assert.deepEqual(behavior.sample(now), reference.sample(now));
  }
  assert.equal(behavior.react(REACTION_COOLDOWN_MS), true);
  assert.equal(behavior.sample(REACTION_COOLDOWN_MS).mood, "reacting");
  finishReaction(behavior, REACTION_COOLDOWN_MS);
  assert.equal(behavior.sample(60_000).mood, "resting");
});

test("clicks rotate three distinct bounded reactions", () => {
  const behavior = createOllieBehavior(0);
  const stories = [];
  let now = 0;
  for (let i = 0; i < 4; i++) {
    assert.equal(behavior.react(now), true);
    const { end, frames } = finishReaction(behavior, now);
    stories.push(frames.map(frameKey).join(","));
    now = end + REST_AFTER_MS;
  }
  assert.equal(new Set(stories.slice(0, 3)).size, 3);
  assert.equal(stories[3], stories[0]);
});

test("returning after a long hidden interval resumes a resting pet", () => {
  const behavior = createOllieBehavior(0);
  behavior.react(0);
  const now = 4 * 60 * 60 * 1_000;
  assert.equal(behavior.sample(now).mood, "resting");
  assert.equal(behavior.react(now), true);
  assert.equal(behavior.sample(now).mood, "reacting");
});

test("idle, rest, and actual click reactions reach the complete frame inventory", () => {
  const behavior = createOllieBehavior(0);
  const seen = new Set(
    sampleFrames(behavior, 0, REST_AFTER_MS + 60_000).map(frameKey),
  );
  let now = REST_AFTER_MS + 60_000;
  for (let i = 0; i < 3; i++) {
    assert.equal(behavior.react(now), true);
    const { end, frames } = finishReaction(behavior, now);
    for (const frame of frames) seen.add(frameKey(frame));
    now = end + REST_AFTER_MS;
  }
  assert.deepEqual(
    [...seen].sort(),
    [...new Set(ollieFrames.map(frameKey))].sort(),
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
