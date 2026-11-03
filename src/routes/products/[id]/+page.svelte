<script lang="ts">
  let { data } = $props();
</script>

<svelte:head><title>{data.product.name} · Elnuara</title></svelte:head>
<section class="empty-page">
  <p class="eyebrow">{data.product.category}</p>
  <h1>{data.product.name}</h1>
  <p>{data.product.story}</p>
</section>
