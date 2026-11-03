<script lang="ts">
  import { resolve } from '$app/paths';
  import { useShop } from '../../state/shop.svelte';
  import { getVariant } from '../../domain/catalog';
  import { money, lineKey } from '../../domain/bag';
  import Photo from '../../components/Photo.svelte';
  import Icon from '../../components/Icon.svelte';
  let {
    compact = false,
    oncontinue = () => {}
  }: { compact?: boolean; oncontinue?: () => void } = $props();
  const shop = useShop();
</script>

{#if !shop.bag.length}<div class="empty-bag">
    <Icon name="leaf" />
    <h2>A little space for<br />your everyday.</h2>
    <p>Your bag is waiting for a ritual of its own.</p>
    <a class="button dark" href={resolve('/collection')} onclick={oncontinue}
      >Explore body & hands <Icon name="arrow" /></a
    >
  </div>{:else}<ul class:compact class="bag-lines">
    {#each shop.bag as line (lineKey(line))}{@const found = getVariant(
        line.productId,
        line.variantId
      )!}
      <li class="bag-line">
        <a
          class="bag-line-image"
          href={resolve('/products/[id]', { id: line.productId })}
          onclick={oncontinue}
          ><Photo
            file={found.variant.image}
            alt={`${found.product.name}, ${found.variant.size}`}
            sizes="140px"
          /></a
        >
        <div class="bag-line-copy">
          <a
            href={resolve('/products/[id]', { id: line.productId })}
            onclick={oncontinue}><h3 data-critical>{found.product.name}</h3></a
          >
          <p>{found.variant.size} · {found.product.scent}</p>
          <span class="unit-price" data-critical
            >{money(found.variant.priceCents)} each</span
          >
          <div class="quantity-control">
            <button
              aria-label={`Decrease ${found.product.name}, ${found.variant.size}`}
              onclick={() => shop.quantity(lineKey(line), line.quantity - 1)}
              ><Icon name="minus" /></button
            ><span data-critical>{line.quantity}</span><button
              aria-label={`Increase ${found.product.name}, ${found.variant.size}`}
              disabled={line.quantity >= found.variant.stock}
              onclick={() => shop.quantity(lineKey(line), line.quantity + 1)}
              ><Icon name="plus" /></button
            >
          </div>
          <button
            class="text-button"
            aria-label={`Remove ${found.product.name}, ${found.variant.size}`}
            onclick={() => shop.quantity(lineKey(line), 0)}>Remove</button
          >
        </div>
        <strong class="line-total" data-critical
          >{money(found.variant.priceCents * line.quantity)}</strong
        >
      </li>{/each}
  </ul>
  <div class="bag-summary">
    <dl>
      <div>
        <dt>Subtotal</dt>
        <dd data-critical>{money(shop.totals.subtotalCents)}</dd>
      </div>
      <div>
        <dt>Standard delivery</dt>
        <dd data-critical>
          {shop.totals.deliveryCents
            ? money(shop.totals.deliveryCents)
            : 'Complimentary'}
        </dd>
      </div>
      <div class="total">
        <dt>Total</dt>
        <dd data-critical>{money(shop.totals.totalCents)}</dd>
      </div>
    </dl>
    <p class="quiet">
      {shop.totals.subtotalCents < 6000
        ? `${money(6000 - shop.totals.subtotalCents)} away from complimentary standard delivery.`
        : 'Your ritual includes complimentary standard delivery.'}
    </p>
    <a class="button dark full" href={resolve('/checkout')} onclick={oncontinue}
      >Continue to demo checkout <Icon name="arrow" /></a
    >
  </div>{/if}
