<script lang="ts">
  import { resolve } from '$app/paths';
  import { useShop } from '../../state/shop.svelte';
  import { getVariant, products } from '../../domain/catalog';
  import { routineSlots, explain, routineTotal } from '../../domain/routine';
  import { money } from '../../domain/bag';
  import type {
    RoutineChoice,
    RoutineSlot,
    Preferences
  } from '../../domain/types';
  import Photo from '../../components/Photo.svelte';
  import Icon from '../../components/Icon.svelte';
  const shop = useShop();
  const labels = {
    cleanse: 'A fresh beginning',
    body: 'Your chosen texture',
    hands: 'A moment for the hands'
  };
  const missing = $derived(
    routineSlots.filter((slot) => !shop.routine.some((c) => c.slot === slot))
  );
  function update(choice: RoutineChoice, patch: Partial<RoutineChoice>) {
    shop.setRoutine(
      shop.routine.map((c) =>
        c.slot === choice.slot ? { ...c, ...patch } : { ...c }
      )
    );
  }
  function changeProduct(choice: RoutineChoice, id: string) {
    const p = products.find((p) => p.id === id && p.slot === choice.slot);
    const v = p?.variants.find((v) => v.stock > 0);
    if (p && v) update(choice, { productId: p.id, variantId: v.id });
  }
  function restoreSlot(slot: RoutineSlot) {
    const p = products.find(
      (p) => p.slot === slot && p.variants.some((v) => v.stock > 0)
    );
    const v = p?.variants.find((v) => v.stock > 0);
    if (p && v)
      shop.setRoutine([
        ...shop.routine,
        { slot, productId: p.id, variantId: v.id }
      ]);
  }
  const preferenceGroups: {
    key: keyof Preferences;
    label: string;
    values: { id: string; label: string; icon?: string }[];
  }[] = [
    {
      key: 'daypart',
      label: 'Your time',
      values: [
        { id: 'morning', label: 'Morning', icon: 'sun' },
        { id: 'evening', label: 'Evening', icon: 'moon' }
      ]
    },
    {
      key: 'texture',
      label: 'Your texture',
      values: [
        { id: 'light', label: 'Light & fluid' },
        { id: 'rich', label: 'Rich & enveloping' }
      ]
    },
    {
      key: 'fragrance',
      label: 'Your notes',
      values: [
        { id: 'fragranced', label: 'With fragrance' },
        { id: 'unfragranced', label: 'Unfragranced' }
      ]
    }
  ];
  function choose(key: keyof Preferences, value: string) {
    if (key === 'daypart' && (value === 'morning' || value === 'evening'))
      shop.preferencesChange({ daypart: value });
    if (key === 'texture' && (value === 'light' || value === 'rich'))
      shop.preferencesChange({ texture: value });
    if (
      key === 'fragrance' &&
      (value === 'fragranced' || value === 'unfragranced')
    )
      shop.preferencesChange({ fragrance: value });
  }
</script>

<section class="routine-intro">
  <p class="eyebrow">MAKE ROOM FOR YOUR OWN RHYTHM</p>
  <h1 data-critical>A ritual,<br /><em>your way.</em></h1>
  <p>
    A few preferences. Three considered places to begin.<br />Keep what feels
    right, change what doesn’t.
  </p>
</section>
<div class="routine-workspace">
  <aside class="routine-preferences" aria-label="Ritual preferences">
    <p class="eyebrow">01 / FIND YOUR RHYTHM</p>
    {#each preferenceGroups as group (group.key)}<fieldset>
        <legend>{group.label}</legend
        >{#each group.values as option (option.id)}<label
            class:selected={shop.preferences[group.key] === option.id}
            ><input
              type="radio"
              name={group.key}
              value={option.id}
              checked={shop.preferences[group.key] === option.id}
              onchange={() => choose(group.key, option.id)}
            />{#if option.icon}<Icon name={option.icon} />{/if}<span
              >{option.label}</span
            ><span class="radio-mark"></span></label
          >{/each}
      </fieldset>{/each}
    <p class="preference-note">
      Suggestions follow the timing, texture and scent notes in this collection.
      They are a starting point for your preferences.
    </p>
    <button class="text-button" onclick={() => shop.restoreRoutine()}
      >Restore suggested ritual</button
    >
  </aside>
  <section class="routine-choices" aria-label="Your ritual choices">
    <div class="routine-choices-heading">
      <p class="eyebrow">02 / MAKE IT YOURS</p>
      <span
        >{shop.routine.length}
        {shop.routine.length === 1 ? 'choice' : 'choices'}</span
      >
    </div>
    {#if !shop.routine.length}<div class="empty-ritual">
        <Icon name="leaf" />
        <h2>A little space<br />to make your own.</h2>
        <p>Add one choice, or start with our suggestions.</p>
        <button class="button outline" onclick={() => shop.restoreRoutine()}
          >Restore suggestions <Icon name="arrow" /></button
        >
      </div>{/if}{#each shop.routine as choice (choice.slot)}{@const found =
        getVariant(choice.productId, choice.variantId)!}
      <article
        class="routine-choice"
        aria-label={`${choice.slot} ritual choice`}
      >
        <div class="routine-choice-image">
          <Photo
            file={found.variant.image}
            alt={`${found.product.name}, ${found.variant.size}`}
            sizes="(max-width:600px) 35vw, 240px"
          />
        </div>
        <div class="routine-choice-copy">
          <p class="eyebrow">
            {String(routineSlots.indexOf(choice.slot) + 1).padStart(2, '0')} / {labels[
              choice.slot
            ]}
          </p>
          <h2 data-critical>{found.product.name}</h2>
          <p class="choice-reason">{explain(choice, shop.preferences)}</p>
          <div class="routine-choice-selects">
            <label
              ><span class="visually-hidden">Product for {choice.slot}</span
              ><select
                aria-label={`Product for ${choice.slot}`}
                value={choice.productId}
                onchange={(e) => changeProduct(choice, e.currentTarget.value)}
                >{#each products.filter((p) => p.slot === choice.slot) as p (p.id)}<option
                    value={p.id}>{p.name}</option
                  >{/each}</select
              ></label
            ><label
              ><span class="visually-hidden">Size for {choice.slot}</span
              ><select
                aria-label={`Size for ${choice.slot}`}
                value={choice.variantId}
                onchange={(e) =>
                  update(choice, { variantId: e.currentTarget.value })}
                >{#each found.product.variants as v (v.id)}<option
                    value={v.id}
                    disabled={!v.stock}
                    >{v.size}{v.stock ? '' : ' · Unavailable'}</option
                  >{/each}</select
              ></label
            >
          </div>
          <div class="routine-choice-footer">
            <span data-critical>{money(found.variant.priceCents)}</span><button
              class="text-button"
              aria-label={`Remove ${choice.slot} choice`}
              onclick={() =>
                shop.setRoutine(
                  shop.routine.filter((c) => c.slot !== choice.slot)
                )}>Remove</button
            ><a href={resolve('/products/[id]', { id: found.product.id })}
              >A closer look ↗</a
            >
          </div>
        </div>
      </article>{/each}{#if missing.length}<div class="missing-choices">
        {#each missing as slot (slot)}<button
            class="text-button"
            onclick={() => restoreSlot(slot)}
            >+ Add a {slot === 'body' ? 'body-care' : slot} choice</button
          >{/each}
      </div>{/if}
    <div class="routine-total">
      <div>
        <span class="eyebrow">YOUR RITUAL, GATHERED</span>
        <p>
          <span data-critical>{money(routineTotal(shop.routine))}</span><small
            >{shop.routine.length}
            {shop.routine.length === 1 ? 'choice' : 'choices'}</small
          >
        </p>
      </div>
      <button
        class="button dark"
        disabled={!shop.routine.length}
        onclick={() => shop.addRitual()}
        >Add ritual to bag <Icon name="plus" /></button
      >
    </div>
  </section>
</div>
