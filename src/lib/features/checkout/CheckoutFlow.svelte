<script lang="ts">
  import { tick } from 'svelte';
  import { resolve } from '$app/paths';
  import { useShop } from '../../state/shop.svelte';
  import {
    emptyContact,
    validateContact,
    createConfirmation,
    type ContactDraft,
    type OrderConfirmation
  } from '../../domain/checkout';
  import ContactForm from './ContactForm.svelte';
  import OrderSummary from './OrderSummary.svelte';
  import Icon from '../../components/Icon.svelte';
  const shop = useShop();
  let stage = $state<'details' | 'review' | 'confirmed'>('details');
  let contact = $state<ContactDraft>(emptyContact());
  let review = $state.raw<OrderConfirmation | null>(null);
  let confirmation = $state.raw<OrderConfirmation | null>(null);
  let signature = '';
  let flowError = $state('');
  let heading: HTMLHeadingElement;
  async function focusHeading() {
    await tick();
    heading?.focus();
  }
  function previewOrder(): OrderConfirmation {
    return createConfirmation(
      shop.bag,
      {
        name: 'Sample details',
        email: 'sample@example.com',
        address: '1 Sample Lane',
        city: 'Sample',
        postalCode: 'A1 1AA',
        country: 'Ireland'
      },
      'preview'
    );
  }
  async function reviewDetails(draft: ContactDraft) {
    contact = { ...draft };
    flowError = '';
    try {
      review = createConfirmation(
        shop.bag,
        contact,
        'ELN-' + crypto.randomUUID().slice(0, 8).toUpperCase()
      );
      signature = JSON.stringify(shop.bag);
      stage = 'review';
      await focusHeading();
    } catch (error) {
      flowError =
        error instanceof Error
          ? error.message
          : 'Your choices could not be reviewed.';
    }
  }
  async function place() {
    flowError = '';
    try {
      if (JSON.stringify(shop.bag) !== signature) {
        review = createConfirmation(
          shop.bag,
          contact,
          'ELN-' + crypto.randomUUID().slice(0, 8).toUpperCase()
        );
        signature = JSON.stringify(shop.bag);
        flowError =
          'Your bag changed. Please review the updated items before placing the demo order.';
        return;
      }
      if (Object.keys(validateContact(contact)).length || !review)
        throw Error('Check your details before continuing.');
      confirmation = review;
      shop.clearBag();
      shop.message = '';
      stage = 'confirmed';
      await focusHeading();
    } catch (error) {
      flowError =
        error instanceof Error
          ? error.message
          : 'Your demo order could not be completed.';
    }
  }
</script>

<section class="checkout-page">
  <a class="checkout-back" href={resolve('/bag')}>← Back to your bag</a>
  <p class="eyebrow">A LITTLE CLOSER TO YOUR EVERYDAY</p>
  <h1 bind:this={heading} tabindex="-1" data-critical>
    {stage === 'confirmed'
      ? 'Your ritual is gathered.'
      : stage === 'review'
        ? 'One last look.'
        : 'Gather your everyday.'}
  </h1>
  <div class="checkout-progress" aria-label="Checkout progress">
    <span class:current={stage === 'details'}>01 Details</span><span
      class:current={stage === 'review'}>02 Review</span
    ><span class:current={stage === 'confirmed'}>03 A fresh beginning</span>
  </div>
  {#if stage === 'confirmed' && confirmation}<div class="confirmation-layout">
      <div class="confirmation-copy">
        <span class="confirmation-mark"><Icon name="check" /></span>
        <p class="eyebrow">A LOCAL DEMO CONFIRMATION</p>
        <h2 data-critical>
          Thank you,<br /><span class="contact-name"
            >{confirmation.contact.name}.</span
          >
        </h2>
        <p>
          This demonstration is complete. No order has been sent, no payment has
          been taken, and no email will be sent.
        </p>
        <p class="confirmation-reference">
          Demo reference <strong data-testid="confirmation-reference"
            >{confirmation.orderId}</strong
          >
        </p>
        <div class="delivery-address">
          <h3>Your demonstration details</h3>
          <p data-testid="confirmed-email">{confirmation.contact.email}</p>
          <p>
            {confirmation.contact.address}<br />{confirmation.contact.city}, {confirmation
              .contact.postalCode}<br />{confirmation.contact.country}
          </p>
        </div>
        <a class="button dark" href={resolve('/routine')}
          >Make room for another ritual <Icon name="arrow" /></a
        >
      </div>
      <OrderSummary order={confirmation} />
    </div>{:else if !shop.bag.length}<div class="empty-checkout">
      <Icon name="leaf" />
      <h2>Your everyday<br />starts with a choice.</h2>
      <p>Your bag is empty. Explore a texture, a note, or a ritual to begin.</p>
      <a class="button dark" href={resolve('/collection')}
        >Explore the collection <Icon name="arrow" /></a
      >
    </div>{:else}<div class="checkout-layout">
      {#if stage === 'details'}<ContactForm
          initial={contact}
          onvalid={reviewDetails}
        /><OrderSummary order={previewOrder()} />{:else if review}<div
          class="checkout-review"
        >
          <p class="eyebrow">02 / A CONSIDERED LAST LOOK</p>
          <h2>Your details, your ritual.</h2>
          <div class="delivery-address">
            <h3>Delivery details</h3>
            <p class="contact-name">{review.contact.name}</p>
            <p>{review.contact.email}</p>
            <p>
              {review.contact.address}<br />{review.contact.city}, {review
                .contact.postalCode}<br />{review.contact.country}
            </p>
            <button
              class="text-button"
              onclick={() => {
                stage = 'details';
                focusHeading();
              }}>Edit details</button
            >
          </div>
          <p class="checkout-demo-note">
            A demonstration only. No payment details are requested and no
            purchase will be made.
          </p>
          {#if flowError}<p class="form-error" role="alert">
              {flowError}
            </p>{/if}<button class="button dark full" onclick={place}
            >Place demo order <Icon name="arrow" /></button
          >
        </div>
        <OrderSummary order={review} />{/if}
    </div>
    {#if flowError && stage === 'details'}<p class="form-error" role="alert">
        {flowError}
      </p>{/if}{/if}
</section>
