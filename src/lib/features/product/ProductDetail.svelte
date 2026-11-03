<script lang="ts">
  import { untrack } from 'svelte';
  import { resolve } from '$app/paths';
  import type { Product } from '../../domain/types';
  import { products } from '../../domain/catalog';
  import { money } from '../../domain/bag';
  import { useShop } from '../../state/shop.svelte';
  import Photo from '../../components/Photo.svelte';
  import Icon from '../../components/Icon.svelte';
  import ProductCard from '../catalog/ProductCard.svelte';
  let { product }: { product: Product } = $props();
  const shop = useShop();
  let selected = $state(untrack(() => product.variants[0].id));
  let quantity = $state(1);
  const variant = $derived(product.variants.find((v) => v.id === selected)!);
  let gallery: HTMLDialogElement;
  let galleryTrigger: HTMLButtonElement | undefined;
  function select(id: string) {
    selected = id;
    quantity = 1;
  }
  function enlarge(event: MouseEvent) {
    if (event.currentTarget instanceof HTMLButtonElement)
      galleryTrigger = event.currentTarget;
    gallery.showModal();
  }
  function add(event: SubmitEvent) {
    event.preventDefault();
    shop.add(product.id, variant.id, quantity);
  }
  const related = $derived(
    products.filter((p) => p.id !== product.id).slice(0, 3)
  );
</script>

<div class="product-breadcrumb">
  <a href={resolve('/collection')}>Body & hands</a><span>/</span><span
    >{product.name}</span
  >
</div>
<section class="product-detail">
  <div class="product-gallery">
    <button
      class="gallery-main"
      aria-label={`Enlarge ${product.name}, ${variant.size}`}
      onclick={enlarge}
      ><Photo
        file={variant.image}
        alt={`${product.name}, ${variant.size}, ${product.packaging}`}
        loading="eager"
        sizes="(max-width:800px) 100vw, 55vw"
      /><span><Icon name="expand" />A closer look</span></button
    >
    <div class="gallery-thumbnails" aria-label="Size-specific photographs">
      {#each product.variants as option (option.id)}<button
          aria-label={`View ${option.size} photo`}
          aria-pressed={variant.id === option.id}
          onclick={() => select(option.id)}
          ><Photo file={option.image} alt="" sizes="100px" /><span
            >{option.size}</span
          ></button
        >{/each}
      <p>Each size,<br />its own considered form.</p>
    </div>
  </div>
  <div class="product-information">
    <p class="eyebrow">
      {product.type} / {product.scent === 'Unfragranced'
        ? 'WITHOUT FRAGRANCE'
        : product.scent + ' NOTES'}
    </p>
    <h1 data-critical>{product.name}</h1>
    <p class="product-story">{product.story}</p>
    <div class="product-character">
      <span>{product.texture} texture</span><span
        >{product.scent === 'Unfragranced'
          ? 'Unfragranced'
          : product.scent + ' scent'}</span
      >
    </div>
    <form onsubmit={add}>
      <fieldset class="size-selector">
        <legend>Choose your size</legend
        >{#each product.variants as option (option.id)}<label
            class:selected={variant.id === option.id}
            ><input
              type="radio"
              name="size"
              value={option.id}
              checked={variant.id === option.id}
              onchange={() => select(option.id)}
            /><span>{option.size}</span><span data-critical
              >{money(option.priceCents)}</span
            >{#if !option.stock}<small>Unavailable</small>{/if}</label
          >{/each}
      </fieldset>
      <div class="product-price-line">
        <strong data-critical data-testid="product-price"
          >{money(variant.priceCents)}</strong
        ><span class:unavailable={!variant.stock}
          >{variant.stock
            ? 'Available for your ritual'
            : 'This size is currently unavailable'}</span
        >
      </div>
      <div class="add-to-bag-row">
        <label class="product-quantity"
          ><span class="visually-hidden">Quantity</span><input
            aria-label="Quantity"
            type="number"
            min="1"
            max={Math.max(1, variant.stock)}
            step="1"
            required
            disabled={!variant.stock}
            bind:value={quantity}
          /></label
        ><button type="submit" class="button dark" disabled={!variant.stock}
          >{variant.stock ? 'Add to bag' : 'Currently unavailable'}<Icon
            name="plus"
          /></button
        >
      </div>
    </form>
    <p class="delivery-note">
      Standard delivery €4.50 · Complimentary from €60
    </p>
    <div class="product-notes">
      <details open>
        <summary>The feel <Icon name="down" /></summary>
        <p>{product.feel}</p>
      </details>
      <details>
        <summary>The everyday <Icon name="down" /></summary>
        <p>
          {product.dayparts.length === 2
            ? 'A place in your morning or evening.'
            : 'An evening moment.'} Pair it with a texture you enjoy. Your ritual
          is yours to shape.
        </p>
      </details>
      <details>
        <summary>The object <Icon name="down" /></summary>
        <p>{product.materialNote}</p>
      </details>
    </div>
    <a class="text-link" href={resolve('/routine')}
      >Make it part of your ritual <Icon name="arrow" /></a
    >
  </div>
</section>
<section class="related-products section-pad">
  <div class="section-heading">
    <div>
      <p class="eyebrow">A LITTLE MORE TO COME BACK TO</p>
      <h2 data-critical>Good company.</h2>
    </div>
    <a class="text-link" href={resolve('/collection')}
      >Explore the collection <Icon name="arrow" /></a
    >
  </div>
  <div class="product-grid related-grid">
    {#each related as item, index (item.id)}<ProductCard
        product={item}
        {index}
      />{/each}
  </div>
</section>
<dialog
  class="gallery-dialog"
  bind:this={gallery}
  aria-label={`${product.name} photograph`}
  oncancel={(event) => {
    event.preventDefault();
    gallery.close();
  }}
  onclose={() => {
    if (!gallery.open) galleryTrigger?.focus();
  }}
>
  <div class="gallery-dialog-heading">
    <span>{product.name} · {variant.size}</span><button
      class="icon-button"
      aria-label="Close photograph"
      onclick={() => gallery.close()}><Icon name="close" /></button
    >
  </div>
  <Photo
    file={variant.image}
    alt={`${product.name}, ${variant.size}, enlarged packaging photograph`}
    loading="eager"
    sizes="(max-width:800px) 100vw, 800px"
  />
  <p>{variant.size} · {product.materialNote}</p>
</dialog>
