// Generates web-optimized album images + a manifest from source photo folders.
// Originals are never modified. Re-run after adding albums: node scripts/build-photos.mjs
import sharp from "sharp";
import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

const albums = [
  { slug: "jersey-city", title: "Jersey City", date: "June 2026", order: 1, location: "NYC",
    sequence: ["02.webp", "01.webp", "03.webp", "04.webp", "05.webp", "06.webp"],
    sources: ["C:/Photos/2026/060826_NYC_Jersey City/Edited"] },
  { slug: "financial-district", title: "Financial District", date: "June 2026", order: 2, location: "NYC",
    sequence: ["10.webp", "09.webp", "01.webp", "02.webp", "06.webp", "08.webp", "07.webp", "03.webp", "05.webp", "04.webp"],
    sources: ["C:/Photos/2026/060926_NYC_Financial District/Edited"] },
  { slug: "flatiron", title: "Flatiron", date: "June 2026", order: 3, location: "NYC",
    caption: "Flatiron Walk",
    sequence: ["05.webp", "01.webp", "04.webp", "02.webp", "03.webp"],
    sources: ["C:/Photos/2026/061126_NYC_Flat Iron/Edited"] },
  { slug: "midtown", title: "Midtown", date: "June 2026", order: 4, location: "NYC",
    sources: ["C:/Photos/2026/061626_NYC_Midtown/Edited"] },
  { slug: "midtown-ii", title: "Midtown II", date: "June 2026", order: 5, location: "NYC",
    sources: ["C:/Photos/2026/061626_NYC_Midtown/Edited 2"] },
  { slug: "temple-run", title: "Temple Run", date: "June 2026", order: 6, location: "Seoul",
    caption: "Temple Run",
    sequence: ["03.webp", "01.webp", "04.webp", "02.webp"],
    sources: ["C:/Photos/2026/062126_062926_Seoul/062126_D1_Insadong/Jogyesa Temple"] },
  { slug: "convenience", title: "Convenience", date: "June 2026", order: 7, location: "Seoul",
    caption: "Convenience",
    sequence: ["01.webp", "02.webp"],
    sources: ["C:/Photos/2026/062126_062926_Seoul/062126_D1_Insadong/Convenience"] },
  { slug: "life-in-korea", title: "Life in Korea", date: "June 2026", order: 8, location: "Seoul",
    caption: "Life in Korea",
    sequence: ["04.webp", "02.webp", "05.webp", "03.webp", "01.webp"],
    sources: ["C:/Photos/2026/062126_062926_Seoul/062226_D2_Gyeongbokgung/062226_D2_Insa-Dong/062226_D2_Daily Life_Final"] },
  { slug: "field-crossing", title: "Field Crossing", date: "June 2026", order: 9, location: "Seoul",
    caption: "Field Crossing",
    sources: ["C:/Photos/2026/062126_062926_Seoul/062226_D2_Gyeongbokgung/062226_D2_Gyeongbokgung Palace/062226_D2_Field Crossing_Final"] },
  { slug: "parting-ways", title: "Parting Ways", date: "June 2026", order: 10, location: "Seoul",
    caption: "Parting Ways",
    sequence: ["04.webp", "01.webp", "02.webp", "03.webp"],
    sources: ["C:/Photos/2026/062126_062926_Seoul/062226_D2_Gyeongbokgung/062226_D2_Gyeongbokgung Palace/062226_D2_Palace_Final"] },
  { slug: "need-coffee", title: "Need Coffee", date: "June 2026", order: 11, location: "Seoul",
    caption: "Need Coffee",
    files: ["C:/Photos/2026/062126_062926_Seoul/062326_D3_Cheonggyecheon_Insadong/062326_D3_Insadong-dong Day/DSC00931.jpg"] },
  { slug: "seoul-by-night", title: "Seoul By Night", date: "June 2026", order: 12, location: "Seoul",
    caption: "Seoul By Night",
    files: ["C:/Photos/2026/062126_062926_Seoul/062326_D3_Cheonggyecheon_Insadong/062326_D3_Ikseon-dong Night/062326_D3_Ikseon-dong Night_Final/DSC00943.jpg"] },
  { slug: "hanging-out-to-dry", title: "Hanging Out To Dry", date: "June 2026", order: 13, location: "Seoul",
    caption: "Hanging Out To Dry",
    files: ["C:/Photos/2026/062126_062926_Seoul/062426_D4_Angukdong/DSC01019.jpg"] },
  { slug: "rising-in-the-east", title: "Rising In The East", date: "June 2026", order: 14, location: "Seoul",
    caption: "Rising In The East",
    files: ["C:/Photos/2026/062126_062926_Seoul/062426_D4_Angukdong/DSC01002.jpg"] },
  { slug: "record-shop", title: "Record Shop", date: "June 2026", order: 15, location: "Seoul",
    caption: "Drill and Decks",
    files: ["C:/Photos/2026/062126_062926_Seoul/062626_D6_Haebangchon/DSC01120.jpg"] },
  { slug: "plastic-chairs", title: "Plastic Chairs", date: "June 2026", order: 16, location: "Seoul",
    caption: "Palette",
    files: ["C:/Photos/2026/062126_062926_Seoul/062626_D6_Haebangchon/DSC01215.jpg"] },
  { slug: "blue-truck", title: "Blue Truck", date: "June 2026", order: 17, location: "Seoul",
    caption: "Blue Steel",
    files: ["C:/Photos/2026/062126_062926_Seoul/062626_D6_Haebangchon/DSC01209.jpg"] },
  { slug: "god-is-good", title: "God Is Good", date: "June 2026", order: 18, location: "Seoul",
    caption: "Got Lemonade",
    files: ["C:/Photos/2026/062126_062926_Seoul/062626_D6_Haebangchon/DSC01191.jpg"] },
  { slug: "back-alley", title: "Back Alley", date: "June 2026", order: 19, location: "Seoul",
    caption: "Next Door Neighbours",
    files: ["C:/Photos/2026/062126_062926_Seoul/062626_D6_Haebangchon/DSC01227.jpg"] },
  { slug: "green-bus", title: "Green Bus", date: "June 2026", order: 20, location: "Seoul",
    caption: "Waiting for the bus in Haebangchon, Seoul.",
    files: ["C:/Photos/2026/062126_062926_Seoul/062626_D6_Haebangchon/DSC01145.jpg"] },
  { slug: "daily-life-haebangchon", title: "Daily Life", date: "June 2026", order: 21, location: "Seoul",
    caption: "Daily life on the street in Haebangchon, Seoul.",
    files: ["C:/Photos/2026/062126_062926_Seoul/062626_D6_Haebangchon/DSC01187.jpg"] },
  { slug: "lighted-pathway", title: "Lighted Pathway", date: "June 2026", order: 22, location: "Seoul",
    caption: "Lighted pathway in Itaewon, Seoul.",
    files: ["C:/Photos/2026/062126_062926_Seoul/062626_D6_Haebangchon/DSC01089.jpg"] },
  { slug: "drinking-out", title: "Drinking Out", date: "June 2026", order: 23, location: "Seoul",
    caption: "Drinking on the street in Haebangchon, Seoul.",
    files: ["C:/Photos/2026/062126_062926_Seoul/062626_D6_Haebangchon/DSC01233.jpg"] },
  { slug: "seoul-style", title: "Seoul Style", date: "June 2026", order: 25, location: "Seoul",
    caption: "Seoul style. Couple walking in Seoul Forest Park.",
    files: ["C:/Photos/2026/062126_062926_Seoul/062726_D7_Seongsu/DSC01408.jpg"] },
  { slug: "street-corner", title: "Street Corner", date: "June 2026", order: 24, location: "Seoul",
    caption: "Biker on street corner in Haebangchon, Seoul.",
    files: ["C:/Photos/2026/062126_062926_Seoul/062626_D6_Haebangchon/DSC01229.jpg"] },
  { slug: "namsan-park", title: "Namsan Park", date: "June 2026", order: 28, location: "Seoul",
    caption: "Namsan Park road to Seoul Tower.",
    files: ["C:/Photos/2026/062126_062926_Seoul/062826_D8_Namsan/DSC01431.jpg"] },
  { slug: "colourful-road", title: "Colourful Road", date: "June 2026", order: 26, location: "Seoul",
    caption: "Colourful road in Haebangchon, Seoul.",
    files: ["C:/Photos/2026/062126_062926_Seoul/062826_D8_Namsan/DSC01480.jpg"] },
  { slug: "motorcyclist", title: "Motorcyclist", date: "June 2026", order: 27, location: "Seoul",
    caption: "Motorcyclist on intersection at Haebangchon, Seoul.",
    files: ["C:/Photos/2026/062126_062926_Seoul/062826_D8_Namsan/DSC01509.jpg"] },
  { slug: "mob-of-aunties", title: "Mob of Aunties", date: "June 2026", order: 29, location: "Seoul",
    caption: "Mob of aunties in Haebangchon, Seoul.",
    files: ["C:/Photos/2026/062126_062926_Seoul/062826_D8_Namsan/DSC01488.jpg"] },
  { slug: "seongsu", title: "Seongsu", date: "June 2026", order: 30, location: "Seoul",
    caption: "Street scene in Seongsu, Seoul.",
    files: ["C:/Photos/2026/062126_062926_Seoul/062726_D7_Seongsu/DSC01310.jpg"] },
  { slug: "barney-greengrass", title: "Barney Greengrass", date: "July 2026", order: 31, location: "NYC",
    caption: "A UPS van drives past Barney Greengrass, a historic Jewish deli on the Upper West Side.",
    files: ["C:/Photos/2026/070326_Photo Uno Week 4/Motion Blur.jpg"] },
  { slug: "dollar-and-a-dream", title: "Dollar and a Dream", date: "July 2026", order: 32, location: "NYC",
    caption: "Delivery driver cycles through the Upper West Side on a Friday morning.",
    files: ["C:/Photos/2026/070326_Upper West Side/DSC01812.jpg"] },
  { slug: "los-tacos", title: "Los Tacos", date: "July 2026", order: 33, location: "NYC",
    caption: "Brazilian supporters gather at Los Tacos, a renowned NYC chain restaurant, having lost to Norway in the 2026 World Cup Round of 16.",
    files: ["C:/Photos/2026/070526_Penn Station/DSC01944.jpg"] },
  { slug: "horrors-of-capitalism", title: "Horrors of Capitalism", date: "July 2026", order: 34, location: "NYC",
    caption: "Horrors of Capitalism. Face from billboard is projected in a distorted way onto passing NYC yellow cabs.",
    files: ["C:/Photos/2026/070526_Penn Station/DSC01961.jpg"] },
  { slug: "ipanema-beach", title: "Ipanema Beach", date: "July 2026", order: 35, location: "Rio",
    files: ["C:/Photos/2026/070926_Ipanema/DSC02076.jpg"] },
  { slug: "ipanema-sunset", title: "Ipanema Sunset", date: "July 2026", order: 36, location: "Rio",
    files: ["C:/Photos/2026/070926_Ipanema/DSC02165.jpg"] },
  { slug: "arpoador", title: "Arpoador", date: "July 2026", order: 37, location: "Rio",
    files: ["C:/Photos/2026/071026_Ipanema 2/DSC02212.jpg"] },
  { slug: "pedra-do-arpoador", title: "Pedra do Arpoador", date: "July 2026", order: 38, location: "Rio",
    files: ["C:/Photos/2026/071026_Ipanema 2/DSC02214.jpg"] },
  { slug: "high-tide", title: "High Tide", date: "July 2026", order: 39, location: "Rio",
    files: ["C:/Photos/2026/071026_Ipanema 2/DSC02224.jpg"] },
  { slug: "painted-rock", title: "Painted Rock", date: "July 2026", order: 40, location: "Rio",
    files: ["C:/Photos/2026/071026_Ipanema 2/DSC02247.jpg"] },
  { slug: "beach-day", title: "Beach Day", date: "July 2026", order: 41, location: "Rio",
    files: ["C:/Photos/2026/071026_Ipanema 2/DSC02278.jpg"] },
  { slug: "boardwalk", title: "Boardwalk", date: "July 2026", order: 42, location: "Rio",
    files: ["C:/Photos/2026/071026_Ipanema 2/DSC02283.jpg"] },
  { slug: "lagoa", title: "Lagoa", date: "July 2026", order: 43, location: "Rio",
    files: ["C:/Photos/2026/071026_Ipanema 2/DSC02289.jpg"] },
  // orders 44-54 reserved for Sugarloaf (Jul 11) + Parque Lage (Jul 12) when ready
  { slug: "copacabana", title: "Copacabana", date: "July 2026", order: 61, location: "Rio",
    caption: "A morning in Copacabana. The sidewalks bustle with different street vendors without disturbing you, the sounds of the waves crashing against the golden sand and the juxtaposition of the sprawling but manageable city against the mountainous backdrop.",
    files: [
      "C:/Photos/2026/071326_Botanical Garden 1/DSC03151.jpg",
      "C:/Photos/2026/071326_Botanical Garden 1/DSC03152.jpg",
      "C:/Photos/2026/071326_Botanical Garden 1/DSC03156.jpg",
      "C:/Photos/2026/071326_Botanical Garden 1/DSC03168.jpg",
      "C:/Photos/2026/071326_Botanical Garden 1/DSC03169.jpg",
      "C:/Photos/2026/071326_Botanical Garden 1/DSC03127.jpg",
    ] },
  { slug: "garden-arch", title: "Garden Arch", date: "July 2026", order: 60, location: "Rio",
    caption: "Yellow Rust. Effortlessly curated garden fixtures at the Jardim Botânico Rio De Janeiro, a beautiful area so close to the beach and city.",
    files: ["C:/Photos/2026/071326_Botanical Garden 1/DSC03231.jpg"] },
  { slug: "gardeners", title: "Gardeners", date: "July 2026", order: 63, location: "Rio",
    caption: "Three trees. Workers at the botanical garden in Rio transporting equipment around the vast expansive plot, one of the standout places of natural beauty to visit.",
    files: ["C:/Photos/2026/071426_Botanical Garden 2/DSC03701.jpg"] },
  { slug: "lily-pads", title: "Lily Pads", date: "July 2026", order: 62, location: "Rio",
    caption: "Birds of prey. Camouflaged heron waits on the giant lily pad in search of something at the botanical gardens in Rio.",
    files: ["C:/Photos/2026/071426_Botanical Garden 2/DSC03820.jpg"] },
  { slug: "little-island", title: "Little Island", date: "July 2026", order: 65, location: "NYC",
    caption: "Long Exposure Little Islands. Sunset on a perfect summer night in NYC overlooking the Little Islands, a striking architectural landmark jutting out onto the Hudson River.",
    files: ["C:/Photos/2026/071926_West Side Highway/DSC04398.jpg"] },
  { slug: "west-side-highway", title: "West Side Highway", date: "July 2026", order: 64, location: "NYC",
    caption: "Boating in NYC. Boats along the West Side Highway, a famous walking route along the piers alongside the Hudson River with Jersey in the background.",
    files: ["C:/Photos/2026/071926_West Side Highway/DSC04350.jpg"] },
];

const outRoot = path.join(root, "public", "photos", "albums");
await fs.rm(outRoot, { recursive: true, force: true });
const manifest = [];

for (const album of albums) {
  const outDir = path.join(outRoot, album.slug);
  const thumbDir = path.join(outDir, "thumb");
  await fs.mkdir(thumbDir, { recursive: true });

  const files = [];
  if (album.files) {
    files.push(...album.files);
  } else {
    for (const src of album.sources) {
      let entries = [];
      try { entries = await fs.readdir(src); } catch { continue; }
      for (const e of entries) if (/\.(jpe?g|png)$/i.test(e)) files.push(path.join(src, e));
    }
    files.sort();
  }

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
  const entry = { slug: album.slug, title: album.title, date: album.date, order: album.order, files: ordered };
  if (album.location) entry.location = album.location;
  if (album.caption) entry.caption = album.caption;
  manifest.push(entry);
  console.log(`${album.slug}: ${out.length} photos`);
}

manifest.sort((a, b) => b.order - a.order);
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
