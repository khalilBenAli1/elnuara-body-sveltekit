<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { page } from '$app/state';
  import { goto } from '$app/navigation';
  import { resolve } from '$app/paths';
  import { products } from '../../domain/catalog';
  import { categories, scents } from '../../domain/types';
  import {
    defaultFilters,
    readFilters,
    queryFor,
    filterProducts,
    type Filters
  } from '../../domain/filters';
  import ProductCard from './ProductCard.svelte';
  import Icon from '../../components/Icon.svelte';
  let filters = $state<Filters>(defaultFilters());
  let mounted = $state(false);
  let pending = $state(0);
  let navigationError = $state('');
  let active = true;
  let navigation = Promise.resolve();
  onMount(() => {
    filters = readFilters((page.shallow?.url ?? page.url).searchParams);
    mounted = true;
  });
  onDestroy(() => {
    active = false;
  });
  $effect(() => {
    const query = (page.shallow?.url ?? page.url).search;
    if (mounted && pending === 0)
      filters = readFilters(new URLSearchParams(query));
  });
  const visible = $derived(filterProducts(products, filters));
  function update(patch: Partial<Filters>) {
    filters = { ...filters, ...patch };
    const query = queryFor(filters);
    pending++;
    navigation = navigation
      .then(async () => {
        if (active)
          await goto(resolve(`/collection${query}`), {
            replace: true,
            shallow: true,
            reset: false
          });
      })
      .catch((error: unknown) => {
        navigationError =
          error instanceof Error
            ? error.message
            : 'The filters could not update the address. Reload and try again.';
      })
      .finally(() => {
        pending--;
      });
  }
</script>

<section class="collection-page section-pad">
  <div class="collection-heading">
    <p class="eyebrow">CONSIDERED, FOR THE EVERYDAY</p>
    <h1 data-critical>Body & hands.</h1>
    <p>
      A handful of familiar gestures. Find the textures and notes<br />that feel
      like a natural part of your day.
    </p>
  </div>
  <div class="collection-tools">
    <fieldset class="type-filters" disabled={!mounted}>
      <legend class="visually-hidden">Product type</legend><button
        class:selected={filters.category === 'All'}
        aria-pressed={filters.category === 'All'}
        onclick={() => update({ category: 'All' })}
        >All essentials <span>08</span></button
      >{#each categories as category (category)}<button
          class:selected={filters.category === category}
          aria-pressed={filters.category === category}
          onclick={() => update({ category })}>{category}</button
        >{/each}
    </fieldset>
    <div class="filter-selects">
      <label
        >Scent<select
          disabled={!mounted}
          aria-label="Scent"
          value={filters.scent}
          onchange={(e) => {
            const scent =
              scents.find((s) => s === e.currentTarget.value) ?? 'All';
            update({ scent });
          }}
          ><option>All</option>{#each scents as scent (scent)}<option
              >{scent}</option
            >{/each}</select
        ></label
      ><label
        >Price<select
          disabled={!mounted}
          aria-label="Price"
          value={filters.price}
          onchange={(e) => {
            const v = e.currentTarget.value;
            update({ price: v === '3000' || v === '4000' ? v : 'any' });
          }}
          ><option value="any">Any price</option><option value="3000"
            >Up to €30</option
          ><option value="4000">Up to €40</option></select
        ></label
      ><label
        >Sort<select
          disabled={!mounted}
          aria-label="Sort"
          value={filters.sort}
          onchange={(e) => {
            const v = e.currentTarget.value;
            update({
              sort: v === 'price-low' || v === 'price-high' ? v : 'featured'
            });
          }}
          ><option value="featured">Our everyday edit</option><option
            value="price-low">Price: low to high</option
          ><option value="price-high">Price: high to low</option></select
        ></label
      >
    </div>
  </div>
  <div class="result-line">
    <p role="status">
      {visible.length}
      {visible.length === 1 ? 'essential' : 'essentials'} for your everyday
    </p>
    {#if queryFor(filters)}<button
        class="text-button"
        onclick={() => update(defaultFilters())}>Clear filters</button
      >{/if}
  </div>
  {#if navigationError}<p class="form-error" role="alert">
      {navigationError}
    </p>{/if}{#if visible.length}<div class="product-grid">
      {#each visible as product, index (product.id)}<ProductCard
          {product}
          {index}
        />{/each}
    </div>{:else}<div class="empty-results">
      <Icon name="leaf" />
      <h2>A little room<br />to explore.</h2>
      <p>
        No essentials match that combination. Try another note or clear your
        filters.
      </p>
      <button class="button dark" onclick={() => update(defaultFilters())}
        >Explore all eight <Icon name="arrow" /></button
      >
    </div>{/if}
</section>
