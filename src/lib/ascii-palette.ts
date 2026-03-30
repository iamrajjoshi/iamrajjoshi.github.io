import { prepareWithSegments } from "@chenglou/pretext";

export type PaletteEntry = {
  char: string;
  weight: number;
  style: "normal" | "italic";
  font: string;
  width: number;
  brightness: number;
};

const CHARSET = ".:'-~+=*!?|/\\(){}[]<>#@&$%^";
const WEIGHTS = [300, 500, 800] as const;
const STYLES = ["normal", "italic"] as const;

let cachedPalette: PaletteEntry[] | null = null;
let cachedFontFamily: string | null = null;
let cachedFontSize: number | null = null;

function estimateBrightness(
  char: string,
  font: string,
  size: number
): number {
  const canvas = document.createElement("canvas");
  const pad = Math.ceil(size * 0.4);
  canvas.width = Math.ceil(size * 1.5);
  canvas.height = Math.ceil(size * 1.5);
  const ctx = canvas.getContext("2d")!;
  ctx.font = font;
  ctx.fillStyle = "white";
  ctx.textBaseline = "middle";
  ctx.fillText(char, pad * 0.5, canvas.height / 2);
  const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
  let sum = 0;
  for (let i = 3; i < data.length; i += 4) {
    sum += data[i];
  }
  return sum / (canvas.width * canvas.height * 255);
}

export function buildPalette(
  fontFamily: string = "Inter",
  fontSize: number = 14
): PaletteEntry[] {
  if (cachedPalette && cachedFontFamily === fontFamily && cachedFontSize === fontSize) {
    return cachedPalette;
  }

  const entries: PaletteEntry[] = [];

  for (const weight of WEIGHTS) {
    for (const style of STYLES) {
      const fontStr = `${style === "italic" ? "italic " : ""}${weight} ${fontSize}px ${fontFamily}`;
      for (const char of CHARSET) {
        const brightness = estimateBrightness(char, fontStr, fontSize);
        const prepared = prepareWithSegments(char, `${fontSize}px ${fontFamily}`);
        const width =
          prepared.segments.length > 0
            ? (prepared as any).widths?.[0] ?? fontSize * 0.6
            : fontSize * 0.6;

        entries.push({
          char,
          weight,
          style,
          font: fontStr,
          width,
          brightness,
        });
      }
    }
  }

  entries.sort((a, b) => a.brightness - b.brightness);

  cachedPalette = entries;
  cachedFontFamily = fontFamily;
  cachedFontSize = fontSize;
  return entries;
}

export function findBestChar(
  palette: PaletteEntry[],
  targetBrightness: number,
  targetWidth?: number
): PaletteEntry {
  // Binary search for closest brightness
  let lo = 0;
  let hi = palette.length - 1;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (palette[mid].brightness < targetBrightness) lo = mid + 1;
    else hi = mid;
  }

  // Score +-15 neighbors
  const searchRange = 15;
  const start = Math.max(0, lo - searchRange);
  const end = Math.min(palette.length - 1, lo + searchRange);

  let best = palette[lo];
  let bestScore = Infinity;

  for (let i = start; i <= end; i++) {
    const p = palette[i];
    let score = Math.abs(p.brightness - targetBrightness) * 2.5;
    if (targetWidth !== undefined) {
      score += Math.abs(p.width - targetWidth) / targetWidth;
    }
    if (score < bestScore) {
      bestScore = score;
      best = p;
    }
  }

  return best;
}

export function getCharsetChars(): string[] {
  return CHARSET.split("");
}
