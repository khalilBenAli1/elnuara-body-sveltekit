<script lang="ts">
  import { resolve } from '$app/paths';
  import Photo from '#lib/components/Photo.svelte';
  import Icon from '#lib/components/Icon.svelte';
  import ProductCard from '#lib/features/catalog/ProductCard.svelte';
  import { products } from '#lib/domain/catalog.ts';
  const favourites = products.filter((p) =>
    ['citrus-veil', 'leaf-milk', 'amber-current', 'soft-palm'].includes(p.id)
  );
</script>

<svelte:head
  ><title>Elnuara — small rituals, fully felt</title><meta
    name="description"
    content="Sensory body and hand care for a slower everyday. Explore Elnuara’s original fictional collection and create a ritual of your own."
  /></svelte:head
>
<section class="ritual-stage" aria-labelledby="hero-title">
  <div class="stage-topline">
    <span class="eyebrow">BODY & HAND CARE</span><span class="eyebrow"
      >AN EVERYDAY KIND OF PAUSE</span
    >
  </div>
  <h1 id="hero-title" data-critical>
    Come back to<br /><em>the everyday.</em>
  </h1>
  <div class="stage-aperture">
    <Photo
      file="ritual-still-life.webp"
      alt="Citrus Veil amber wash, sage Leaf Milk lotion and Amber Current oil in a sculptural still life"
      width={1200}
      height={800}
      loading="eager"
      sizes="(max-width:600px) 95vw, 62vw"
    />
  </div>
  <div class="sensory-rail">
    <span class="rail-line"></span><span>01 / A fresh beginning</span><span
      >02 / A softer rhythm</span
    ><span>03 / A warmer finish</span>
  </div>
  <div class="stage-bottom">
    <p>A familiar gesture.<br />A different feeling.</p>
    <a class="button cream" href={resolve('/collection')}
      >Explore the collection <Icon name="arrow" /></a
    ><span class="stage-number">E / 01</span>
  </div>
  <span class="stage-orbit" aria-hidden="true"></span>
</section>
<section class="intro-section">
  <span class="eyebrow">CARE, IN YOUR OWN TIME</span>
  <h2 data-critical>Not another thing to do.<br />A moment to come back to.</h2>
  <p>
    From the first turn of the tap to the last quiet minutes of the day.
    Considered textures, familiar notes, and objects that make the small things
    feel a little more like yours.
  </p>
  <a class="text-link" href={resolve('/routine')}
    >Find your everyday ritual <Icon name="arrow" /></a
  >
</section>
<section class="favourites section-pad">
  <div class="section-heading">
    <div>
      <p class="eyebrow">THE EVERYDAY EDIT</p>
      <h2 data-critical>A few good beginnings.</h2>
    </div>
    <a class="text-link" href={resolve('/collection')}
      >Discover all eight <Icon name="arrow" /></a
    >
  </div>
  <div class="product-grid">
    {#each favourites as product, index (product.id)}<ProductCard
        {product}
        {index}
      />{/each}
  </div>
</section>
<section class="ritual-invitation">
  <div class="invitation-number">02</div>
  <p class="eyebrow">A RITUAL, AT YOUR PACE</p>
  <h2 data-critical>
    Morning light.<br />Evening quiet.<br /><em>Whatever feels like you.</em>
  </h2>
  <p>
    Choose your time, texture, and fragrance preference.<br />We’ll gather a few
    thoughtful places to start.
  </p>
  <a class="button dark" href={resolve('/routine')}
    >Create your ritual <Icon name="arrow" /></a
  ><Icon name="leaf" />
</section>
<section class="materials-teaser">
  <div class="materials-photo">
    <Photo
      file="botanical-textures.webp"
      alt="Citrus peel, sage leaves, soft linen and pale stone"
      width={1200}
      height={800}
    />
  </div>
  <div class="materials-copy">
    <p class="eyebrow">A NOTE ON THE SENSES</p>
    <h2 data-critical>Texture.<br />Light.<br />A little green.</h2>
    <p>
      The notes and materials that give our everyday its character. A closer
      look at the details we keep coming back to.
    </p>
    <a class="text-link" href={resolve('/materials')}
      >Read the notes <Icon name="arrow" /></a
    >
  </div>
</section>
