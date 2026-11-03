<script lang="ts">
  import { onMount } from 'svelte';
  import { resolve } from '$app/paths';
  import { page } from '$app/state';
  import { createShop } from '#lib/state/shop.svelte.ts';
  import Icon from '#lib/components/Icon.svelte';
  import BagContents from '#lib/features/bag/BagContents.svelte';
  import '../app.css';
  let { children } = $props();
  const shop = createShop();
  let bagDialog: HTMLDialogElement;
  let menuDialog: HTMLDialogElement;
  let resetDialog: HTMLDialogElement;
  let bagOpen = $state(false),
    menuOpen = $state(false);
  let bagTrigger: HTMLButtonElement | undefined,
    menuTrigger: HTMLButtonElement | undefined,
    resetTrigger: HTMLButtonElement | undefined;
  onMount(() => {
    try {
      shop.hydrate(window.localStorage);
    } catch {
      shop.blocked();
    }
  });
  function openBag(event: MouseEvent) {
    if (event.currentTarget instanceof HTMLButtonElement)
      bagTrigger = event.currentTarget;
    bagDialog.showModal();
    bagOpen = true;
  }
  function openMenu(event: MouseEvent) {
    if (event.currentTarget instanceof HTMLButtonElement)
      menuTrigger = event.currentTarget;
    menuDialog.showModal();
    menuOpen = true;
  }
  function openReset(event: MouseEvent) {
    if (event.currentTarget instanceof HTMLButtonElement)
      resetTrigger = event.currentTarget;
    resetDialog.showModal();
  }
  const links = [
    { url: '/collection', label: 'Body & hands' },
    { url: '/routine', label: 'Your ritual' },
    { url: '/materials', label: 'Notes & materials' }
  ] as const;
</script>

<svelte:head
  ><meta property="og:site_name" content="Elnuara" /><meta
    property="og:type"
    content="website"
  /><meta
    property="og:image"
    content="https://khalilbenali1.github.io/elnuara-body-sveltekit/images/ritual-still-life.webp"
  /><meta name="twitter:card" content="summary_large_image" /></svelte:head
>
<a href="#main" class="skip-link">Skip to content</a>
<div class="announcement">
  <span>Small rituals. A slower everyday.</span><span
    >Complimentary standard delivery from €60</span
  >
</div>
<header class="site-header">
  <button
    class="menu-trigger icon-button"
    aria-label="Open navigation"
    aria-expanded={menuOpen}
    onclick={openMenu}><Icon name="menu" /></button
  ><a class="wordmark" href={resolve('/')} aria-label="Elnuara home">elnuara</a>
  <nav class="desktop-nav" aria-label="Main navigation">
    {#each links as link (link.url)}<a
        href={resolve(link.url)}
        aria-current={page.url.pathname.includes(link.url) ? 'page' : undefined}
        >{link.label}</a
      >{/each}
  </nav>
  <button
    class="bag-trigger"
    aria-label={`Open bag, ${shop.totals.count} items`}
    aria-expanded={bagOpen}
    onclick={openBag}
    ><span>Bag <span class="bag-count">{shop.totals.count}</span></span><Icon
      name="bag"
    /></button
  >
</header>
{#if shop.loaded && shop.storageStatus !== 'ready'}<div
    class="storage-notice"
    role="alert"
  >
    <p>
      {shop.storageStatus === 'corrupt'
        ? 'Your saved bag and ritual could not be read. The original data has been left untouched; new choices stay here for this visit until you reset.'
        : 'Your browser cannot save this bag. You can keep browsing and use the demo checkout during this visit.'}
    </p>
    <button class="text-button" onclick={openReset}
      >Reset saved bag & ritual</button
    >
  </div>{/if}
<main id="main">{@render children()}</main>
<footer class="site-footer">
  <div class="footer-top">
    <a class="wordmark" href={resolve('/')}>elnuara</a>
    <p>Small rituals,<br />fully felt.</p>
    <nav aria-label="Footer navigation">
      {#each links as link (link.url)}<a href={resolve(link.url)}
          >{link.label}</a
        >{/each}<a href={resolve('/bag')}>Your bag</a>
    </nav>
  </div>
  <div class="footer-bottom">
    <span>Original fictional portfolio shop · no real orders</span><button
      class="text-button"
      onclick={openReset}>Reset saved bag & ritual</button
    ><span>© 2026 Elnuara</span>
  </div>
</footer>
{#if shop.message}<div class="toast" role="status">
    <span>{shop.message}</span><a href={resolve('/bag')}>View bag</a><button
      aria-label="Dismiss update"
      onclick={() => (shop.message = '')}><Icon name="close" /></button
    >
  </div>{/if}{#if shop.error}<div class="toast error-toast" role="alert">
    <span>{shop.error}</span><button
      aria-label="Dismiss error"
      onclick={() => (shop.error = '')}><Icon name="close" /></button
    >
  </div>{/if}
<dialog
  class="bag-dialog"
  bind:this={bagDialog}
  aria-labelledby="bag-title"
  oncancel={(e) => {
    e.preventDefault();
    bagDialog.close();
  }}
  onclose={() => {
    if (bagDialog.open) return;
    bagOpen = false;
    bagTrigger?.focus();
  }}
>
  <div class="dialog-heading">
    <div>
      <p class="eyebrow">A LITTLE OF THE EVERYDAY</p>
      <h2 id="bag-title">Your bag <span>({shop.totals.count})</span></h2>
    </div>
    <button
      class="icon-button"
      aria-label="Close bag"
      onclick={() => bagDialog.close()}><Icon name="close" /></button
    >
  </div>
  <BagContents compact oncontinue={() => bagDialog.close()} />
</dialog>
<dialog
  class="menu-dialog"
  bind:this={menuDialog}
  aria-label="Navigation"
  oncancel={(e) => {
    e.preventDefault();
    menuDialog.close();
  }}
  onclose={() => {
    if (menuDialog.open) return;
    menuOpen = false;
    menuTrigger?.focus();
  }}
>
  <div class="dialog-heading">
    <span class="wordmark">elnuara</span><button
      class="icon-button"
      aria-label="Close navigation"
      onclick={() => menuDialog.close()}><Icon name="close" /></button
    >
  </div>
  <nav aria-label="Mobile navigation">
    {#each links as link (link.url)}<a
        href={resolve(link.url)}
        onclick={() => menuDialog.close()}>{link.label}<Icon name="arrow" /></a
      >{/each}
  </nav>
  <p>A little room for the everyday.</p>
</dialog>
<dialog
  class="reset-dialog"
  bind:this={resetDialog}
  aria-labelledby="reset-title"
  oncancel={(e) => {
    e.preventDefault();
    resetDialog.close();
  }}
  onclose={() => {
    if (!resetDialog.open) resetTrigger?.focus();
  }}
>
  <div class="dialog-heading">
    <span class="eyebrow">A FRESH EVERYDAY</span><button
      class="icon-button"
      aria-label="Close reset dialog"
      onclick={() => resetDialog.close()}><Icon name="close" /></button
    >
  </div>
  <h2 id="reset-title">Start a fresh ritual?</h2>
  <p>
    This clears Elnuara’s saved bag and routine on this device. Other sites and
    their saved data stay as they are.
  </p>
  <div class="dialog-actions">
    <button class="button outline" onclick={() => resetDialog.close()}
      >Keep my choices</button
    ><button
      class="button dark"
      onclick={() => {
        shop.reset();
        resetDialog.close();
      }}>Reset Elnuara choices</button
    >
  </div>
</dialog>
