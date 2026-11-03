<script lang="ts">
  import { money } from '../../domain/bag';
  import type { OrderConfirmation } from '../../domain/checkout';
  import Photo from '../../components/Photo.svelte';
  let { order }: { order: OrderConfirmation } = $props();
</script>

<aside class="order-summary" aria-label="Order summary">
  <p class="eyebrow">THE EVERYDAY, GATHERED</p>
  <ul>
    {#each order.lines as line (`${line.productId}:${line.variantId}`)}<li>
        <div class="order-image">
          <Photo
            file={line.image}
            alt={`${line.name}, ${line.size}`}
            sizes="100px"
          />
        </div>
        <div>
          <h3 data-critical>{line.name}</h3>
          <p>{line.size} · Qty {line.quantity}</p>
          <span data-critical>{money(line.unitCents * line.quantity)}</span>
        </div>
      </li>{/each}
  </ul>
  <dl>
    <div>
      <dt>Subtotal</dt>
      <dd data-critical>{money(order.totals.subtotalCents)}</dd>
    </div>
    <div>
      <dt>Standard delivery</dt>
      <dd data-critical>
        {order.totals.deliveryCents
          ? money(order.totals.deliveryCents)
          : 'Complimentary'}
      </dd>
    </div>
    <div class="total">
      <dt>Total</dt>
      <dd data-critical data-testid="order-total">
        {money(order.totals.totalCents)}
      </dd>
    </div>
  </dl>
</aside>
