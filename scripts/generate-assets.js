const fs = require("fs");
const path = require("path");

const publicDir = path.resolve(__dirname, "../apps/demo/public");
const outputDir = path.resolve(
  __dirname,
  "../packages/react-ipod-classic/src/assets"
);

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const assetFiles = [
  "sad_mac.svg",
  "gloss-overlay.svg",
  "gloss-blue.svg",
  "scrubber.svg",
  "volume_mute.svg",
  "volume_full.svg",
  "play.svg",
  "pause.svg",
  "dice.svg",
  "logo.svg",
  "arrow_right.svg",
  "ipod_logo.svg",
  "search_icon.svg",
  "artists_icon.svg",
  "albums_icon.svg",
  "song_icon.svg",
  "playlist_icon.svg",
  "palm.svg",
  "default_album_artwork.png",
  "themes_preview.png",
  "mnelia_signature.png",
];

let tsContent =
  "/* Auto-generated asset data URLs for standalone package */\n\n";

for (const file of assetFiles) {
  const filePath = path.join(publicDir, file);
  if (!fs.existsSync(filePath)) {
    console.warn("Missing file:", file);
    continue;
  }
  const ext = path.extname(file).toLowerCase();
  const baseName = path.basename(file, ext).replace(/[^a-zA-Z0-9]/g, "_");
  const buffer = fs.readFileSync(filePath);
  const mime = ext === ".svg" ? "image/svg+xml" : "image/png";
  const base64 = buffer.toString("base64");
  const dataUrl = `data:${mime};base64,${base64}`;

  tsContent += `export const ASSET_${baseName.toUpperCase()} = "${dataUrl}";\n`;
}

fs.writeFileSync(path.join(outputDir, "index.ts"), tsContent, "utf-8");
process.stdout.write("Successfully generated assets/index.ts\n");
