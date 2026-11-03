<script lang="ts">
  import ProductDetail from '#lib/features/product/ProductDetail.svelte';
  let { data } = $props();
</script>

<svelte:head
  ><title>{data.product.name} · Elnuara</title><meta
    name="description"
    content={data.product.story}
  /></svelte:head
>{#key data.product.id}<ProductDetail product={data.product} />{/key}
