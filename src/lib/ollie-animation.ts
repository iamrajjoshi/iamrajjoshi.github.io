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

// Short gestures separated by quiet breathing; every animation gets a turn.
const playlist: [AnimationName, number, number][] = [
  ["idle", 3, 150],
  ["waving", 2, 180],
  ["idle", 2, 150],
  ["running-right", 3, 110],
  ["running-left", 3, 110],
  ["idle", 2, 150],
  ["jumping", 2, 150],
  ["idle", 2, 150],
  ["working", 2, 190],
  ["review", 2, 180],
  ["waiting", 2, 180],
  ["failed", 1, 180],
  ["idle", 2, 150],
  ["look-around", 1, 180],
  ["idle", 2, 150],
];

export const ollieFrames: readonly OllieFrame[] = playlist.flatMap(
  ([animation, loops, duration]) => {
    const { row, count } = animations[animation];
    return Array.from({ length: count * loops }, (_, index) => {
      const frame = index % count;
      return {
        animation,
        row: row + Math.floor(frame / 8),
        column: frame % 8,
        duration,
      };
    });
  },
);
