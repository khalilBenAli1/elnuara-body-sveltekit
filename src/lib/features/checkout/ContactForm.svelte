<script lang="ts">
  import { untrack, tick } from 'svelte';
  import {
    countries,
    validateContact,
    type ContactDraft,
    type ContactErrors
  } from '../../domain/checkout';
  import Icon from '../../components/Icon.svelte';
  let {
    initial,
    onvalid
  }: { initial: ContactDraft; onvalid: (contact: ContactDraft) => void } =
    $props();
  let draft = $state(untrack(() => ({ ...initial })));
  let errors = $state<ContactErrors>({});
  let form: HTMLFormElement;
  const fields: {
    key: Exclude<keyof ContactDraft, 'country'>;
    label: string;
    max: number;
    type?: string;
  }[] = [
    { key: 'name', label: 'Full name', max: 100 },
    { key: 'email', label: 'Email address', max: 254, type: 'email' },
    { key: 'address', label: 'Street address', max: 160 },
    { key: 'city', label: 'City', max: 80 },
    { key: 'postalCode', label: 'Postal code', max: 16 }
  ];
  async function submit(event: SubmitEvent) {
    event.preventDefault();
    errors = validateContact(draft);
    if (Object.keys(errors).length) {
      await tick();
      const key = Object.keys(errors)[0];
      const input = form.elements.namedItem(key);
      if (input instanceof HTMLElement) input.focus();
      return;
    }
    onvalid({ ...draft });
  }
</script>

<form
  class="contact-form"
  bind:this={form}
  onsubmit={submit}
  novalidate
  autocomplete="off"
>
  <p class="eyebrow">01 / YOUR DETAILS</p>
  <h2>A place for your ritual.</h2>
  <p class="checkout-demo-note">
    This is a local demo checkout. Use invented details; no payment is taken and
    no order is sent.
  </p>
  {#if Object.keys(errors).length}<p class="form-error" role="alert">
      A few details need another look.
    </p>{/if}
  <div class="contact-fields">
    {#each fields as field (field.key)}<label
        class:wide={field.key === 'address' ||
          field.key === 'email' ||
          field.key === 'name'}
        >{field.label}<input
          aria-label={field.label}
          name={field.key}
          type={field.type ?? 'text'}
          required
          maxlength={field.max}
          bind:value={draft[field.key]}
          aria-invalid={!!errors[field.key]}
          aria-describedby={errors[field.key]
            ? `error-${field.key}`
            : undefined}
          inputmode={field.key === 'email' ? 'email' : undefined}
        />{#if errors[field.key]}<span
            class="field-error"
            id={`error-${field.key}`}>{errors[field.key]}</span
          >{/if}</label
      >{/each}<label class="wide"
      >Country<select
        aria-label="Country"
        name="country"
        required
        bind:value={draft.country}
        aria-invalid={!!errors.country}
        aria-describedby={errors.country ? 'error-country' : undefined}
        ><option value="">Choose a destination</option
        >{#each countries as country (country)}<option>{country}</option
          >{/each}</select
      >{#if errors.country}<span class="field-error" id="error-country"
          >{errors.country}</span
        >{/if}</label
    >
  </div>
  <div class="checkout-delivery">
    <span class="eyebrow">ONE CONSIDERED WAY TO GET THERE</span>
    <p>Standard delivery <span>€4.50 · complimentary from €60</span></p>
  </div>
  <button class="button dark full" type="submit"
    >Review your ritual <Icon name="arrow" /></button
  >
</form>
