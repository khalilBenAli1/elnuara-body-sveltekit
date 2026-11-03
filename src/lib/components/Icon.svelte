<script lang="ts">
  let { name = 'leaf' }: { name?: string } = $props();
  const paths: Record<string, string> = {
    leaf: 'M4 20C4 8 12 4 21 3c0 12-5 18-14 15M3 22 16 9',
    bag: 'M5 7h14l2 14H3L5 7Zm3 0V5a4 4 0 0 1 8 0v2',
    arrow: 'M3 12h17m-6-6 6 6-6 6',
    close: 'm5 5 14 14M5 19 19 5',
    plus: 'M12 4v16M4 12h16',
    minus: 'M4 12h16',
    menu: 'M3 7h18M3 16h18',
    sun: 'M12 2v2m0 16v2M2 12h2m16 0h2M5 5l2 2m10 10 2 2M5 19l2-2M17 7l2-2M17 12a5 5 0 1 1-10 0 5 5 0 0 1 10 0Z',
    moon: 'M20 15A9 9 0 0 1 9 4a9 9 0 1 0 11 11Z',
    check: 'm4 12 5 5L20 6',
    expand: 'M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5',
    down: 'm5 9 7 7 7-7'
  };
</script>

<svg
  width="20"
  height="20"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="1.5"
  stroke-linecap="round"
  stroke-linejoin="round"
  aria-hidden="true"><path d={paths[name] ?? paths.leaf} /></svg
>
