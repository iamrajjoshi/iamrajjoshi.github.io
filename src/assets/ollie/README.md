# Ollie artwork

- `spritesheet.webp`: lossless WebP, 768 × 1144 pixels, 8 columns × 11 rows of 96 × 104 pixel cells. The original atlas is 1536 × 2288 with 192 × 208 pixel cells.
- `still.webp`: the first idle frame (row 0, column 0), 96 × 104 pixels, for reduced motion and no-JavaScript rendering.
- Rows 0–8 contain idle (6 frames), running right (8), running left (8), waving (4), jumping (5), failed (8), waiting (6), active work (6), and review (6). Row 0, column 6 is an additional neutral pose. Rows 9–10 hold the 16 clockwise look directions. Unused cells remain transparent.

Set `OLLIE_SOURCE` to the full path of the original atlas and `OLLIE_OUTPUT` to the full path of the destination folder. With `sharp` available to Node, this command runs from any directory. If Sharp is installed elsewhere, set `NODE_PATH` to that installation’s `node_modules` folder, for example `export NODE_PATH=/path/to/node_modules`.

These files were encoded with Sharp 0.35.4, libvips 8.18.6, and libwebp 1.6.0; pin those versions for byte-identical output.

The command decodes before resizing so WebP's shrink-on-load optimization cannot soften the artwork. It extracts the still from the shared resized pixels to keep it identical to the atlas frame.

```sh
node - "$OLLIE_SOURCE" "$OLLIE_OUTPUT" <<'NODE'
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const sharp = require('sharp');

(async () => {
  const source = process.argv[2];
  const output = process.argv[3];
  assert(source && path.isAbsolute(source), 'Set OLLIE_SOURCE to the full atlas path.');
  assert(output && path.isAbsolute(output), 'Set OLLIE_OUTPUT to the full destination path.');
  const metadata = await sharp(source).metadata();
  assert.equal(metadata.width, 1536);
  assert.equal(metadata.height, 2288);
  assert.equal(metadata.hasAlpha, true);
  await fs.mkdir(output, { recursive: true });
  const decoded = await sharp(source).ensureAlpha().raw().toBuffer();
  const resized = await sharp(decoded, {
    raw: { width: 1536, height: 2288, channels: 4 },
  })
    .resize(768, 1144, { kernel: sharp.kernel.nearest })
    .raw().toBuffer();
  const pixels = { raw: { width: 768, height: 1144, channels: 4 } };
  const atlas = await sharp(resized, pixels)
    .webp({ lossless: true, effort: 6 })
    .toBuffer();
  const still = await sharp(resized, pixels)
    .extract({ left: 0, top: 0, width: 96, height: 104 })
    .webp({ lossless: true, effort: 6 })
    .toBuffer();
  await fs.writeFile(path.join(output, 'spritesheet.webp'), atlas);
  await fs.writeFile(path.join(output, 'still.webp'), still);
})().catch(error => { console.error(error); process.exitCode = 1; });
NODE
```
