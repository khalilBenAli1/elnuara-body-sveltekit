<script lang="ts">
  import { products } from '#lib/domain/catalog.ts';
  import ProductCard from '#lib/features/catalog/ProductCard.svelte';
</script>

<svelte:head><title>Body & hands · Elnuara</title></svelte:head>
<section class="section-pad" style="padding-top:4rem">
  <div class="section-heading">
    <div>
      <p class="eyebrow">CONSIDERED, FOR THE EVERYDAY</p>
      <h1>Body & hands.</h1>
    </div>
    <p class="quiet">Eight objects. A few familiar gestures.</p>
  </div>
  <div class="product-grid">
    {#each products as product, index (product.id)}<ProductCard
        {product}
        {index}
      />{/each}
  </div>
</section>
