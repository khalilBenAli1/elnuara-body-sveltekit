# Delivery and verification

Original Elnuara portfolio application, November3,2026. The local source is complete and the finite gate below has passed. Public release details will be recorded after passing feature-PR and main-branch checks and actual Pages verification; an intended address is not presented here as a verified live result.

## Finite quality gate

| Verification                        | Observed result                                                                                            |
| ----------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Clean Node22.23.1/npm10.9.8 install | `npm ci` passed with local legacy-peer-deps=false                                                          |
| Lint / formatting                   | Passed                                                                                                     |
| Strict Svelte/TypeScript            | Zero errors and warnings                                                                                   |
| Unit tests                          | 46 passed across catalog, bag, routine, filters, adapter, state and checkout                               |
| Required first pilot                | 4 Chromium/WebKit cold product/full checkout and cold-query hydration cases passed before the broad matrix |
| Final combined browser gate         | 88 passed in40.2seconds, zero retries                                                                      |
| Narrow correction recheck           | 10 targeted320px exact doubled-text cases passed before the final gate                                     |
| Visual review                       | 95/100 actual desktop/mobile direction and final major-surface review                                      |
| Screenshot capture                  | No browser warnings/errors/pageerrors or failed assets                                                     |
| Doubled bag prices                  | Exact2x at390/768/1440; document clientWidth equals scrollWidth                                            |

The browser suite keeps default per-test timeouts, separates route/Axe checks, uses no sleeps, and fails on every console warning/error and pageerror without message filtering. Reflow compares `documentElement.scrollWidth` with `documentElement.clientWidth`, never a mobile-expanded innerWidth. The doubled-text helper restores original styles before recapturing, so a second application remains exactly2x rather than compounding. Clipping checks inspect rendered text and overflow ancestors; intentionally hidden accessibility labels and native input/select internals are excluded, while long details are verified fully rendered in review/confirmation.

Coverage includes all eight cold product routes and sixteen size photos/prices/stock states, repeated variant merge versus different sizes, quantity bounds and reload, rapid URL filter composition, empty results, real unfragranced/light fallback and manually edited oil explanation, nonempty reduced rituals, whole-operation overstock rejection, empty rituals, corrupt/unknown/blocked storage, unrelated local-storage sentinel preservation, native touch, keyboard/Escape/focus, actual deferred native-close delivery, reduced motion, Axe and320/390/768/1440 text reflow. Checkout tests include invalid→valid details, plus/apostrophe email support and malformed dot/angle/comma negatives, a100-character unbroken name,160-character address,80-character city,16-character postal and254-character supported email, exact per-size cents and450/free6000 delivery, no contact storage/transmission, frozen detached confirmation and reset behavior.

Actual readable artifacts: screenshots in `docs/screenshots`, [capture measurements](BROWSER_CAPTURES.json), and [build measurements](BUILD_MEASUREMENTS.json). The initial domain/state review identified one inaccurate manual-oil fallback sentence; it was corrected and covered by a regression before release. Focused checks then found shallow-URL synchronization, narrow routine control and contrast issues; those were corrected. The first combined gate’s last six320px doubled-text failures were fixed through intrinsic grid/text bounds and stacked size prices, without hiding overflow or reducing scale.

## Actual production output measurements

Measured from the final adapter-static build with Node filesystem sizes and per-file zlib gzip; these totals span **all routes**, not an initial-page network transfer or latency metric:

| Group                         | Files |     Bytes | Sum of gzip bytes |
| ----------------------------- | ----: | --------: | ----------------: |
| JavaScript                    |    28 |   171,687 |            68,803 |
| CSS                           |     1 |    45,731 |             9,244 |
| WOFF2 fonts                   |     2 |    94,660 |            94,731 |
| Responsive WebP photographs   |    38 | 1,411,424 |         1,412,630 |
| HTML, including deliberate404 |    15 |   241,195 |            52,648 |

Already compressed WOFF2/WebP files may grow under an additional gzip pass. Responsive image sources provide1200px and640px versions. Media native/delivery sizes, the one explicitly disclosed portrait upscale, exact prompts and full hashes are recorded in [image provenance](IMAGE_PROVENANCE.md). No Lighthouse run or invented performance score is claimed.

## Honest limits

This is a static fictional commerce and product-preference demonstration. No live inventory, orders, payment, email, medical advice, certifications, endorsements, skin matching or camera inference are provided. Contacts remain feature-memory data. A confirmation does not survive leaving the feature/reloading; saved bag/routine data stays in one browser and does not synchronize across tabs/devices. There is no offline installation. Stock is a fixture bound, not a server reservation.

Automated Axe and browser checks do not certify accessibility. Actual touch-enabled browser contexts were tested, but physical-device assistive-technology and screen-reader verification was not performed.

The current npm audit reports16 development-tool package findings (4low/12moderate), arising from the deepmerge prototype-poisoning and minimatch glob-amplification advisory families; no high/critical findings. `npm audit --omit=dev` reports zero findings. This does not certify the generated browser bundle’s security. No force downgrade, peer bypass or unverified transitive override was used to conceal tooling findings.
