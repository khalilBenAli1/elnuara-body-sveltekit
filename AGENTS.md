# Elnuara

Original fictional static body-care shop. Node22.23.1/npm10.9.8; local `.npmrc` fixes legacy-peer-deps=false. `npm ci`; `npm run dev`/`preview` on4206; `npm run check`; `npm run test:e2e`. `DEMO_URL` overrides the browser suite base for a verified static deployment. Zero retries; preserve unfiltered browser warning/error guards and clientWidth reflow assertions.

SvelteKit3 configuration lives in vite.config.ts. Keep the /elnuara-body-sveltekit base, absolute supported resolve/asset helpers and prerendered direct routes. Canonical eight-product/sixteen-size IDs, images, per-size cents and stock are in data/catalog and docs/PRODUCT_IMAGE_BRIEF.json. Delivery is standard450c/free>=6000c. Pure domain functions remain independent of Svelte/DOM/storage.

Shop instances belong to each layout context, never a module-global customer singleton. Hydrate only after mount through the strict versioned own-key adapter. Contacts and frozen detached confirmations stay in feature memory, never storage, URLs or network submission. Rituals may be valid nonempty subsets and add atomically; explanations must describe actual selected fixture properties and explicit alternatives. Preserve safe native modal lifetime and focus handling.

Current shallow query URL is `page.shallow.url`, falling back to `page.url` for full/cold routes. Do not reintroduce stale query resets or read cold search state during hydration. Preserve actual image provenance/hashes when replacing generated assets; media paths and their two provenance documents are excluded from broad formatting and checked separately. No health claims, certifications, fake reviews, backend, payment or paid-service dependency.
