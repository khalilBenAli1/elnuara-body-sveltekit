<script lang="ts">
  import { resolve } from '$app/paths';
  import Photo from '#lib/components/Photo.svelte';
  import Icon from '#lib/components/Icon.svelte';
</script>

<svelte:head
  ><title>Notes & materials · Elnuara</title><meta
    name="description"
    content="An original editorial study in scent, texture and considered fictional packaging: citrus, sage, amber and the everyday."
  /></svelte:head
>
<section class="materials-intro">
  <p class="eyebrow">THE CHARACTER OF THE EVERYDAY</p>
  <h1 data-critical>A note on<br /><em>the senses.</em></h1>
  <p>
    A colour that catches the light. A texture you look forward to.<br />The
    familiar details that make a small ritual your own.
  </p>
</section>
<figure class="materials-wide">
  <Photo
    file="botanical-textures.webp"
    alt="Citrus peel, sage leaves, raw linen and warm pale stone in soft light"
    width={1200}
    height={800}
    loading="eager"
    sizes="100vw"
  />
  <figcaption>
    Citrus. A little green. The texture of something familiar.
  </figcaption>
</figure>
<section class="materials-chapters">
  <article>
    <span class="eyebrow">01 / A NOTE OF CITRUS</span>
    <h2 data-critical>A brighter<br />beginning.</h2>
    <p>
      Think of the twist of a peel, the first light through an open window. Our
      citrus scent descriptions borrow that bright, familiar character, leaving
      room for a quieter everyday.
    </p>
    <a class="text-link" href={resolve('/collection?scent=Citrus')}
      >Explore citrus notes <Icon name="arrow" /></a
    >
  </article>
  <article>
    <span class="eyebrow">02 / A LITTLE GREEN</span>
    <h2 data-critical>A softer<br />rhythm.</h2>
    <p>
      Herbal notes bring a green, leafy character to the collection. Light
      lotion, a familiar hand-wash gel, and objects in muted sage make up this
      chapter.
    </p>
    <a class="text-link" href={resolve('/collection?scent=Herbal')}
      >Explore herbal notes <Icon name="arrow" /></a
    >
  </article>
  <article>
    <span class="eyebrow">03 / WITHOUT A NOTE</span>
    <h2 data-critical>Quiet,<br />by choice.</h2>
    <p>
      Sometimes the preference is no added fragrance story. Still Water, Quiet
      Dune and Soft Palm offer different unfragranced textures to choose from:
      gel, rich balm and cream.
    </p>
    <a class="text-link" href={resolve('/collection?scent=Unfragranced')}
      >Explore without fragrance <Icon name="arrow" /></a
    >
  </article>
</section>
<section class="vessel-story">
  <div>
    <Photo
      file="amber-light.webp"
      alt="The canonical Amber Current100 oil bottle catching warm light beside cream fabric"
      width={1200}
      height={1800}
    />
  </div>
  <article>
    <p class="eyebrow">04 / OBJECTS OF THE EVERYDAY</p>
    <h2 data-critical>A way of<br />catching light.</h2>
    <p>
      Amber glass, a brushed-metal collar, a softly rounded sage vessel. These
      are the material notes of our fictional packaging study, considered as
      carefully as the texture inside.
    </p>
    <p>
      Size is part of the object, too. Each size has its own photographed
      proportions, from the folded aluminium hand-cream tube to the broad
      shoulders of a larger wash.
    </p>
    <a class="text-link" href={resolve('/collection')}
      >Meet the objects <Icon name="arrow" /></a
    >
  </article>
</section>
<p class="materials-footnote">
  An original sensory and packaging study. Scent and texture descriptions are
  fictional fixture notes, not verified ingredient lists, treatment advice or
  material certifications.
</p>
