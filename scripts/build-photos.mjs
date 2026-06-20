// Generates web-optimized album images + a manifest from source photo folders.
// Originals are never modified. Re-run after adding albums: node scripts/build-photos.mjs
import sharp from "sharp";
import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

const albums = [
  { slug: "jersey-city", title: "Jersey City", date: "June 2026", order: 1,
    sequence: ["02.webp", "01.webp", "04.webp", "06.webp", "05.webp", "03.webp"],
    sources: ["C:/Photos/2026/060826_NYC_Jersey City/Edited"] },
  { slug: "financial-district", title: "Financial District", date: "June 2026", order: 2,
    sequence: ["04.webp", "03.webp", "05.webp", "09.webp", "10.webp", "06.webp", "01.webp", "08.webp", "07.webp", "02.webp"],
    sources: ["C:/Photos/2026/060926_NYC_Financial District/Edited"] },
  { slug: "flatiron", title: "Flatiron", date: "June 2026", order: 3,
    sequence: ["02.webp", "01.webp", "05.webp", "04.webp", "03.webp"],
    sources: ["C:/Photos/2026/061126_NYC_Flat Iron/Edited"] },
  { slug: "midtown", title: "Midtown", date: "June 2026", order: 4,
    sources: ["C:/Photos/2026/061626_NYC_Midtown/Edited"] },
  { slug: "midtown-ii", title: "Midtown II", date: "June 2026", order: 5,
    sources: ["C:/Photos/2026/061626_NYC_Midtown/Edited 2"] },
];

const outRoot = path.join(root, "public", "photos", "albums");
await fs.rm(outRoot, { recursive: true, force: true });
const manifest = [];

for (const album of albums) {
  const outDir = path.join(outRoot, album.slug);
  const thumbDir = path.join(outDir, "thumb");
  await fs.mkdir(thumbDir, { recursive: true });

  const files = [];
  for (const src of album.sources) {
    let entries = [];
    try { entries = await fs.readdir(src); } catch { continue; }
    for (const e of entries) if (/\.(jpe?g|png)$/i.test(e)) files.push(path.join(src, e));
  }
  files.sort();

  const out = [];
  let i = 1;
  for (const f of files) {
    const name = String(i).padStart(2, "0") + ".webp";
    await sharp(f).rotate().resize({ width: 2000, height: 2000, fit: "inside", withoutEnlargement: true }).webp({ quality: 80 }).toFile(path.join(outDir, name));
    await sharp(f).rotate().resize({ width: 700, height: 700, fit: "inside", withoutEnlargement: true }).webp({ quality: 70 }).toFile(path.join(thumbDir, name));
    out.push(name);
    i++;
  }
  const ordered = album.sequence && album.sequence.length
    ? album.sequence.filter((f) => out.includes(f)).concat(out.filter((f) => !album.sequence.includes(f)))
    : out;
  manifest.push({ slug: album.slug, title: album.title, date: album.date, order: album.order, files: ordered });
  console.log(`${album.slug}: ${out.length} photos`);
}

manifest.sort((a, b) => a.order - b.order);
await fs.writeFile(path.join(root, "src", "data", "photos.json"), JSON.stringify(manifest, null, 2));
console.log("manifest -> src/data/photos.json");

// ---- menswear outfit galleries (per tailor) ----
const menswear = [
  { slug: "wwchan", sources: ["C:/Photos/Menswear/WWChan"] },
];

const mwRoot = path.join(root, "public", "photos", "menswear");
await fs.rm(mwRoot, { recursive: true, force: true });
const mwManifest = [];

for (const g of menswear) {
  const outDir = path.join(mwRoot, g.slug);
  const thumbDir = path.join(outDir, "thumb");
  await fs.mkdir(thumbDir, { recursive: true });

  const files = [];
  for (const src of g.sources) {
    let entries = [];
    try { entries = await fs.readdir(src); } catch { continue; }
    for (const e of entries) if (/\.(jpe?g|png)$/i.test(e)) files.push(path.join(src, e));
  }
  files.sort();

  const out = [];
  let i = 1;
  for (const f of files) {
    const name = String(i).padStart(2, "0") + ".webp";
    await sharp(f).rotate().resize({ width: 2000, height: 2000, fit: "inside", withoutEnlargement: true }).webp({ quality: 80 }).toFile(path.join(outDir, name));
    await sharp(f).rotate().resize({ width: 700, height: 700, fit: "inside", withoutEnlargement: true }).webp({ quality: 70 }).toFile(path.join(thumbDir, name));
    out.push(name);
    i++;
  }
  mwManifest.push({ slug: g.slug, files: out });
  console.log(`menswear/${g.slug}: ${out.length} photos`);
}

await fs.writeFile(path.join(root, "src", "data", "menswear.json"), JSON.stringify(mwManifest, null, 2));
console.log("menswear manifest -> src/data/menswear.json");

// ---- car galleries (per car) ----
const carGalleries = [
  { slug: "porsche-997", sources: ["C:/Photos/Cars/Porsche"] },
  { slug: "mclaren-570s", sources: ["C:/Photos/Cars/McLaren"] },
];

const carRoot = path.join(root, "public", "photos", "cars");
await fs.rm(carRoot, { recursive: true, force: true });
const carManifest = [];

for (const g of carGalleries) {
  const outDir = path.join(carRoot, g.slug);
  const thumbDir = path.join(outDir, "thumb");
  await fs.mkdir(thumbDir, { recursive: true });

  const files = [];
  for (const src of g.sources) {
    let entries = [];
    try { entries = await fs.readdir(src); } catch { continue; }
    for (const e of entries) if (/\.(jpe?g|png)$/i.test(e)) files.push(path.join(src, e));
  }
  files.sort();

  const out = [];
  let i = 1;
  for (const f of files) {
    const name = String(i).padStart(2, "0") + ".webp";
    await sharp(f).rotate().resize({ width: 2000, height: 2000, fit: "inside", withoutEnlargement: true }).webp({ quality: 80 }).toFile(path.join(outDir, name));
    await sharp(f).rotate().resize({ width: 800, height: 800, fit: "inside", withoutEnlargement: true }).webp({ quality: 72 }).toFile(path.join(thumbDir, name));
    out.push(name);
    i++;
  }
  carManifest.push({ slug: g.slug, files: out });
  console.log(`cars/${g.slug}: ${out.length} photos`);
}

await fs.writeFile(path.join(root, "src", "data", "carphotos.json"), JSON.stringify(carManifest, null, 2));
console.log("car manifest -> src/data/carphotos.json");
