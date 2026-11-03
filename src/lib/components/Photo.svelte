<script lang="ts">
  import { photoUrl } from './photo-url';
  let {
    file,
    alt,
    loading = 'lazy',
    sizes = '(max-width:600px) 100vw, 50vw',
    width = 1200,
    height = 1200,
    class: className = ''
  }: {
    file: string;
    alt: string;
    loading?: 'lazy' | 'eager';
    sizes?: string;
    width?: number;
    height?: number;
    class?: string;
  } = $props();
</script>

<img
  class={className}
  src={photoUrl(file)}
  srcset={`${photoUrl(file, true)} 640w, ${photoUrl(file)} 1200w`}
  {sizes}
  {alt}
  {width}
  {height}
  {loading}
/>
