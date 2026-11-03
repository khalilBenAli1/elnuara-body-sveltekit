# Image provenance

Elnuara is a fictional body-care brand. These 19 original selected raster masters were generated specifically for this demo on 3 November 2026 using the **built-in OpenAI `image_gen.imagegen` tool**, with one call per requested asset or size variant. No CLI/API-key path, external stock, real-client photographs or artwork from the other portfolio brands was used.

The readable package descriptions and exact canonical product/size filenames come from [PRODUCT_IMAGE_BRIEF.json](PRODUCT_IMAGE_BRIEF.json). [image-prompts.json](image-prompts.json) contains every exact prompt, local raw-master path, reference role/graph, native dimensions, source SHA-256, exported dimensions, byte counts and all 38 delivered SHA-256 hashes. Raw PNG masters remain outside the repository in the tool’s generated-images directory; only optimized WebPs are distributed here.

## Responsive delivery

Every original has a full-width **1200px** `.webp` and a **640px** `-640.webp` sibling under `static/images/`. All 16 size-specific product views are square. The ritual and botanical campaigns are landscape 3:2; Amber Light is portrait 2:3. Each derivative is the same photograph at a different resolution, not another angle or product.

Sharp performed proportional resizing and opaque WebP conversion only, at quality 82 / effort 6. All 38 files decode successfully, are opaque, have unique hashes, and match the canonical filename/size ledger. The full images total **1,056,890 bytes**, small images **354,534 bytes**, combined **1,411,424 bytes**.

| Product or campaign           | Full filename             | Native pixels | Full / small pixels | Full / small bytes |
| ----------------------------- | ------------------------- | ------------- | ------------------- | ------------------ |
| Citrus Veil Wash / 250 ml     | `citrus-veil-250.webp`    | 1254×1254     | 1200×1200 / 640×640 | 43,520 / 14,558    |
| Citrus Veil Wash / 500 ml     | `citrus-veil-500.webp`    | 1254×1254     | 1200×1200 / 640×640 | 42,346 / 14,384    |
| Still Water Wash / 250 ml     | `still-water-250.webp`    | 1254×1254     | 1200×1200 / 640×640 | 17,998 / 6,198     |
| Still Water Wash / 500 ml     | `still-water-500.webp`    | 1254×1254     | 1200×1200 / 640×640 | 17,780 / 5,940     |
| Leaf Milk Lotion / 200 ml     | `leaf-milk-200.webp`      | 1254×1254     | 1200×1200 / 640×640 | 27,836 / 9,420     |
| Leaf Milk Lotion / 400 ml     | `leaf-milk-400.webp`      | 1254×1254     | 1200×1200 / 640×640 | 27,144 / 8,264     |
| Quiet Dune Balm / 150 ml      | `quiet-dune-150.webp`     | 1254×1254     | 1200×1200 / 640×640 | 48,350 / 14,522    |
| Quiet Dune Balm / 300 ml      | `quiet-dune-300.webp`     | 1254×1254     | 1200×1200 / 640×640 | 52,656 / 14,970    |
| Amber Current Oil / 100 ml    | `amber-current-100.webp`  | 1254×1254     | 1200×1200 / 640×640 | 49,218 / 17,344    |
| Amber Current Oil / 200 ml    | `amber-current-200.webp`  | 1254×1254     | 1200×1200 / 640×640 | 46,330 / 16,128    |
| Stone Grain Polish / 200 g    | `stone-grain-200.webp`    | 1254×1254     | 1200×1200 / 640×640 | 65,092 / 19,772    |
| Stone Grain Polish / 350 g    | `stone-grain-350.webp`    | 1254×1254     | 1200×1200 / 640×640 | 71,818 / 21,764    |
| Palm Leaf Hand Wash / 300 ml  | `palm-leaf-300.webp`      | 1254×1254     | 1200×1200 / 640×640 | 66,282 / 22,282    |
| Palm Leaf Hand Wash / 500 ml  | `palm-leaf-500.webp`      | 1254×1254     | 1200×1200 / 640×640 | 70,796 / 22,970    |
| Soft Palm Hand Cream / 50 ml  | `soft-palm-50.webp`       | 1254×1254     | 1200×1200 / 640×640 | 32,550 / 10,250    |
| Soft Palm Hand Cream / 100 ml | `soft-palm-100.webp`      | 1254×1254     | 1200×1200 / 640×640 | 32,782 / 9,718     |
| ritual-still-life             | `ritual-still-life.webp`  | 1536×1024     | 1200×800 / 640×427  | 58,322 / 20,084    |
| botanical-textures            | `botanical-textures.webp` | 1536×1024     | 1200×800 / 640×427  | 160,170 / 56,158   |
| amber-light                   | `amber-light.webp`        | 1024×1536     | 1200×1800 / 640×960 | 125,900 / 49,808   |

## Packaging continuity

The smaller size of each of the eight product families was generated first and visually inspected. Its larger size was then generated as a reference edit of that exact photograph. Body proportions and the closure-to-body ratio visibly change while the family’s material, colour, silhouette and closure design remain coherent. The 350 g Stone Grain artwork exists even though that fixture has zero available stock. Product photographs are illustrative fictional packaging, not dimensionally measured manufactured vessels.

The ritual campaign references the inspected **Citrus Veil 250 ml**, **Leaf Milk 200 ml** and **Amber Current 100 ml** masters. It keeps those three recognisable vessels, rather than substituting generic bottles. Amber Light references the same canonical 100 ml oil bottle. The botanical macro contains citrus peel, sage, linen and stone as sensory editorial materials; it does not document a formula or imply a clinical benefit. All 19 selected masters and the optimized product-family comparison were visually inspected. No words, logos, endorsements, certification marks, watermarks, people or UI screenshots are embedded in the delivered artwork.

## Native-resolution limit

All 16 product masters are 1254×1254; both landscape masters are 1536×1024. Their full and small exports are downsampled. **Amber Light’s native 1024×1536 master is proportionally upscaled 17.1875% to 1200×1800 for the full export**; its 640×960 derivative is downsampled. The ledger flags this explicitly. No 4K/native-resolution claim is made.

## Source and license notices

These are original generated assets supplied for this fictional portfolio demo; no third-party stock-provider license or client asset permission is part of their provenance. The repository’s code license does not describe external font files. The app owner maintains the separate local font/OFL notices. This file and the exact-prompt ledger cover the generated raster media only.
