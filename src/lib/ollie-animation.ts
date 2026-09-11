export interface OllieFrame {
  animation: string;
  row: number;
  column: number;
  duration: number;
}

const animations = {
  idle: { row: 0, count: 6 },
  "running-right": { row: 1, count: 8 },
  "running-left": { row: 2, count: 8 },
  waving: { row: 3, count: 4 },
  jumping: { row: 4, count: 5 },
  failed: { row: 5, count: 8 },
  waiting: { row: 6, count: 6 },
  working: { row: 7, count: 6 },
  review: { row: 8, count: 6 },
  "look-around": { row: 9, count: 16 },
} as const;

type AnimationName = keyof typeof animations;

function pose(
  animation: AnimationName,
  index: number,
  duration: number,
): OllieFrame {
  return {
    animation,
    row: animations[animation].row + Math.floor(index / 8),
    column: index % 8,
    duration,
  };
}

function clip(animation: AnimationName, duration: number, loops = 1) {
  const { count } = animations[animation];
  return Array.from({ length: count * loops }, (_, i) =>
    pose(animation, i % count, duration),
  );
}

// A quiet companion: little movements separated by comfortable stillness.
const idle = [
  ...clip("idle", 240),
  pose("idle", 6, 10_000),
  ...clip("waiting", 320),
  pose("idle", 0, 12_000),
];
const resting = [
  pose("failed", 2, 550),
  pose("failed", 3, 3600),
  pose("failed", 4, 3600),
  pose("failed", 3, 3600),
];
const waking = [
  pose("failed", 4, 450),
  pose("failed", 3, 400),
  pose("failed", 2, 350),
  pose("failed", 1, 300),
  pose("failed", 0, 300),
  pose("idle", 0, 350),
];

// Each click tells a short story, then Ollie returns to his own quiet routine.
const reactions = [
  [
    // Get his bearings with small side glances and a moment to focus.
    pose("look-around", 0, 400),
    pose("look-around", 1, 250),
    pose("look-around", 2, 450),
    pose("look-around", 1, 250),
    pose("look-around", 0, 300),
    pose("look-around", 15, 250),
    pose("look-around", 14, 450),
    pose("look-around", 15, 250),
    pose("look-around", 0, 400),
    ...clip("review", 230),
    ...clip("waving", 220),
    ...clip("idle", 210),
  ],
  [
    ...clip("waving", 200),
    ...clip("running-right", 140),
    pose("idle", 0, 300),
    ...clip("running-left", 140),
    ...clip("jumping", 170),
    ...clip("waving", 220),
    ...clip("idle", 210),
  ],
  [
    ...clip("failed", 190),
    ...clip("look-around", 250),
    ...clip("review", 230),
    ...clip("working", 220),
    ...clip("waving", 220),
    ...clip("idle", 210),
  ],
];

export const REST_AFTER_MS = 30_000;
export const REST_FOR_MS = 20_000;
export const REACTION_COOLDOWN_MS = 750;
function duration(frames: readonly OllieFrame[]) {
  return frames.reduce((total, frame) => total + frame.duration, 0);
}

const idleDuration = duration(idle);
const restingDuration = duration(resting);
const wakingDuration = duration(waking);
const quietCycleDuration = REST_AFTER_MS + REST_FOR_MS;

function sampleFrames(frames: readonly OllieFrame[], elapsed: number) {
  let remaining = Math.max(0, elapsed);
  for (const frame of frames) {
    if (remaining < frame.duration) {
      return { frame, delay: Math.max(1, frame.duration - remaining) };
    }
    remaining -= frame.duration;
  }
  return { frame: frames[frames.length - 1]!, delay: 1 };
}

function quietPhase(elapsed: number) {
  const time = Math.max(0, elapsed);
  const phase = time % quietCycleDuration;
  return {
    phase,
    sleeping: phase >= REST_AFTER_MS,
    waking: time >= quietCycleDuration && phase < wakingDuration,
    awakeElapsed: phase - (time >= quietCycleDuration ? wakingDuration : 0),
  };
}

function remainingWake(elapsed: number) {
  let remaining = elapsed;
  for (const [index, frame] of waking.entries()) {
    if (remaining < frame.duration) {
      return [
        { ...frame, duration: frame.duration - remaining },
        ...waking.slice(index + 1),
      ];
    }
    remaining -= frame.duration;
  }
  return [];
}

export function createOllieBehavior(now = Date.now()) {
  let idleSince = now;
  let reactionStartedAt: number | undefined;
  let reactionIndex = -1;
  let reactionFrames: readonly OllieFrame[] = [];
  let reactionDuration = 0;
  let wakingUntil = -Infinity;
  let lastClickAt = -Infinity;

  return {
    react(now: number) {
      // Coalesce double clicks; accepted clicks replace a reaction, never queue it.
      if (now < wakingUntil || now - lastClickAt < REACTION_COOLDOWN_MS) {
        return false;
      }
      const quietSince =
        reactionStartedAt === undefined
          ? idleSince
          : reactionStartedAt + reactionDuration;
      const quiet = quietPhase(now - quietSince);
      const needsWake = quiet.sleeping || quiet.waking;
      const wakeElapsed = quiet.waking ? quiet.phase : 0;
      lastClickAt = now;
      // A sleepy Ollie always wakes gently; playfulness comes with more attention.
      reactionIndex = needsWake ? 0 : (reactionIndex + 1) % reactions.length;
      reactionFrames = needsWake
        ? [...remainingWake(wakeElapsed), ...reactions[reactionIndex]!]
        : reactions[reactionIndex]!;
      reactionDuration = duration(reactionFrames);
      wakingUntil = needsWake ? now + wakingDuration - wakeElapsed : -Infinity;
      reactionStartedAt = now;
      return true;
    },
    sample(now: number) {
      if (reactionStartedAt !== undefined) {
        const elapsed = Math.max(0, now - reactionStartedAt);
        if (elapsed < reactionDuration) {
          return {
            ...sampleFrames(reactionFrames, elapsed),
            mood: "reacting" as const,
          };
        }
        idleSince = reactionStartedAt + reactionDuration;
        reactionStartedAt = undefined;
      }

      // Wall time lets Ollie settle while the tab or header is out of sight.
      const quiet = quietPhase(now - idleSince);
      if (quiet.sleeping) {
        const sample = sampleFrames(
          resting,
          (quiet.phase - REST_AFTER_MS) % restingDuration,
        );
        return {
          ...sample,
          delay: Math.min(sample.delay, quietCycleDuration - quiet.phase),
          mood: "resting" as const,
        };
      }
      // Open his eyes on his own, then spend most of the awake phase standing still.
      const sample = quiet.waking
        ? sampleFrames(waking, quiet.phase)
        : sampleFrames(idle, quiet.awakeElapsed % idleDuration);
      return {
        ...sample,
        delay: Math.min(sample.delay, REST_AFTER_MS - quiet.phase),
        mood: "idle" as const,
      };
    },
  };
}
