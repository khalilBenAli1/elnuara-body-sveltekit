<script lang="ts">
  import { resolve } from '$app/paths';
  import type { Product } from '../../domain/types';
  import { money } from '../../domain/bag';
  import Photo from '../../components/Photo.svelte';
  import Icon from '../../components/Icon.svelte';
  let { product, index = 0 }: { product: Product; index?: number } = $props();
  const variant = $derived(product.variants[0]);
</script>

<article class="product-card">
  <a
    class="product-image"
    href={resolve('/products/[id]', { id: product.id })}
    aria-label={`Explore ${product.name}`}
    ><Photo
      file={variant.image}
      alt={`${product.name}, ${variant.size}, ${product.packaging}`}
      sizes="(max-width:600px) 100vw, (max-width:900px) 50vw, 25vw"
      loading={index < 4 ? 'eager' : 'lazy'}
    /><span class="image-arrow"><Icon name="arrow" /></span><span
      class="product-index">{String(index + 1).padStart(2, '0')}</span
    ></a
  >
  <div class="product-card-top">
    <span class="eyebrow">{product.category}</span><span class="scent-note"
      >{product.scent === 'Unfragranced'
        ? 'Without fragrance'
        : product.scent + ' notes'}</span
    >
  </div>
  <a href={resolve('/products/[id]', { id: product.id })}
    ><h3 data-critical>{product.name}</h3></a
  >
  <p>{product.texture} texture · {variant.size}</p>
  <div class="product-price">
    <span data-critical>From {money(variant.priceCents)}</span><a
      href={resolve('/products/[id]', { id: product.id })}
      >Explore <span aria-hidden="true">↗</span></a
    >
  </div>
</article>
