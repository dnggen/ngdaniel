# Photos drop-folder

Drop image files here and tell Daniel/Claude, and they'll be wired into the site.

- **Car photos** → `public/photos/cars/` (e.g. `porsche.jpg`, `mclaren.jpg`)
- **Album photos** → `public/photos/albums/` (e.g. `new-york-1.jpg`, `new-york-2.jpg`)

JPG or PNG are fine. After dropping files in, they get referenced from the matching
JSON file in `src/data/` (`cars.json`, `albums.json`) and go live on the next push.
