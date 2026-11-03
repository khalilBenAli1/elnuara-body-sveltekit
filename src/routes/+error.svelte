<script lang="ts">
  import { page } from '$app/state';
  import { resolve } from '$app/paths';
</script>

<svelte:head><title>A quieter path · Elnuara</title></svelte:head>
<section class="empty-page">
  <p class="eyebrow">{page.status} / A QUIETER PATH</p>
  <h1>A little off<br />the everyday path.</h1>
  <p>This page is still unwritten.</p>
  <a class="button dark" href={resolve('/')}>Return to Elnuara →</a>
</section>
