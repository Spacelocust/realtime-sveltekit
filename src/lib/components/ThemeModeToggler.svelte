<script lang="ts">
  import Moon from 'lucide-svelte/icons/moon';
  import Sun from 'lucide-svelte/icons/sun';
  import { mode, toggleMode } from 'mode-watcher';
  import { fade } from 'svelte/transition';

  import { prefersReducedMotion } from '$utils/preferences';

  import Button from './ui/button/button.svelte';
</script>

<Button on:click={toggleMode} size="icon">
  <span class="sr-only">Toggle theme</span>
  {#if $mode === 'dark'}
    <div in:fade={{ duration: prefersReducedMotion() ? 0 : 250 }}>
      <Moon class="size-6" />
    </div>
  {:else}
    <div in:fade={{ duration: prefersReducedMotion() ? 0 : 250 }}>
      <Sun class="size-6" />
    </div>
  {/if}
</Button>
