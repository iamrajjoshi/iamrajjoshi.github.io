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
  ...clip("idle", 180),
  pose("idle", 6, 4000),
  ...clip("waiting", 230),
  pose("idle", 0, 5000),
];
const resting = [
  pose("failed", 2, 400),
  pose("failed", 3, 2800),
  pose("failed", 4, 2800),
  pose("failed", 3, 2800),
];

// Each click tells a short story, then Ollie returns to his own quiet routine.
const reactions = [
  [
    ...clip("jumping", 100),
    ...clip("look-around", 120),
    ...clip("review", 170),
    ...clip("waving", 160),
    ...clip("idle", 150),
  ],
  [
    ...clip("waving", 140),
    ...clip("running-right", 100, 2),
    ...clip("running-left", 100, 2),
    ...clip("jumping", 120),
    ...clip("waving", 160),
    ...clip("idle", 150),
  ],
  [
    ...clip("failed", 140),
    ...clip("look-around", 100),
    ...clip("review", 170),
    ...clip("working", 160),
    ...clip("waving", 160),
    ...clip("idle", 150),
  ],
];

export const REST_AFTER_MS = 20_000;
export const REACTION_COOLDOWN_MS = 750;
export const ollieFrames: readonly OllieFrame[] = [
  ...idle,
  ...resting,
  ...reactions.flat(),
];

function duration(frames: readonly OllieFrame[]) {
  return frames.reduce((total, frame) => total + frame.duration, 0);
}

const idleDuration = duration(idle);
const restingDuration = duration(resting);
const reactionDurations = reactions.map(duration);

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

export function createOllieBehavior(now = Date.now()) {
  let idleSince = now;
  let reactionStartedAt: number | undefined;
  let reactionIndex = -1;
  let lastClickAt = -Infinity;

  return {
    react(now: number) {
      // Coalesce double clicks; accepted clicks replace a reaction, never queue it.
      if (now - lastClickAt < REACTION_COOLDOWN_MS) return false;
      lastClickAt = now;
      reactionIndex = (reactionIndex + 1) % reactions.length;
      reactionStartedAt = now;
      return true;
    },
    sample(now: number) {
      if (reactionStartedAt !== undefined) {
        const elapsed = Math.max(0, now - reactionStartedAt);
        const reactionDuration = reactionDurations[reactionIndex]!;
        if (elapsed < reactionDuration) {
          return {
            ...sampleFrames(reactions[reactionIndex]!, elapsed),
            mood: "reacting" as const,
          };
        }
        idleSince = reactionStartedAt + reactionDuration;
        reactionStartedAt = undefined;
      }

      // Wall time lets Ollie settle while the tab or header is out of sight.
      const quietTime = Math.max(0, now - idleSince);
      if (quietTime >= REST_AFTER_MS) {
        return {
          ...sampleFrames(
            resting,
            (quietTime - REST_AFTER_MS) % restingDuration,
          ),
          mood: "resting" as const,
        };
      }
      const sample = sampleFrames(idle, quietTime % idleDuration);
      return {
        ...sample,
        delay: Math.min(sample.delay, REST_AFTER_MS - quietTime),
        mood: "idle" as const,
      };
    },
  };
}
