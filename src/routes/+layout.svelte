<script lang="ts">
  import '../app.pcss';

  import { Menu, X } from 'lucide-svelte';
  import { ModeWatcher } from 'mode-watcher';
  import { fade, scale } from 'svelte/transition';
  import { toast } from 'svelte-sonner';
  import { getFlash } from 'sveltekit-flash-message';

  import ThemeModeToggler from '$components/ThemeModeToggler.svelte';
  import { Button } from '$components/ui/button';
  import { Toaster } from '$components/ui/sonner';
  import UserDropdownMenu from '$components/user/UserDropdownMenu.svelte';
  import { prefersReducedMotion } from '$utils/preferences';

  import type { PageData } from './$types';

  import { onNavigate } from '$app/navigation';
  import { page } from '$app/stores';

  export let data: PageData;

  const flash = getFlash(page);

  let isMobileMenuOpen = false;
  let links: { name: string; href: string; current: boolean }[] = [];

  $: links = [
    { name: 'Home', href: '/', current: $page.route.id === '/' },
    { name: 'Game lobbies', href: '/games', current: $page.route.id === '/games' },
  ];

  $: if ($flash) {
    toast[$flash.type]($flash.message);

    $flash = undefined;
  }

  onNavigate((navigation) => {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!document.startViewTransition) {
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      document.startViewTransition(async () => {
        resolve();

        await navigation.complete;
      });
    });
  });
</script>

<svelte:head>
  {#key $page.data.seo}
    {#if $page.data.seo?.title}
      <title>{$page.data.seo.title}</title>
    {/if}
  {/key}
  {#if $page.data.seo?.meta}
    {#each Object.entries($page.data.seo.meta) as [name, content] (name)}
      <meta {name} {content} />
    {/each}
  {/if}
</svelte:head>

<ModeWatcher />
<Toaster visibleToasts={9} duration={8000} />

<div class="min-h-full flex flex-col">
  <!-- Nav + Header -->
  <header class="bg-gray-800 pb-32">
    <div class="bg-gray-800">
      <div class="mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div class="border-b border-gray-700">
          <div class="flex h-16 items-center justify-between px-4 sm:px-0">
            <div class="flex items-center">
              <!-- Logo -->
              <div class="flex-shrink-0">
                <a href="/">
                  <span class="sr-only">Quiz Game Homepage</span>
                  <img
                    class="h-8 w-8"
                    src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
                    alt="Quiz Game logo"
                  />
                </a>
              </div>

              <!-- Avoid having 2 nav with the same links -->
              {#if !isMobileMenuOpen}
                <!-- Desktop links -->
                <div class="hidden md:block">
                  <nav class="ml-10 flex items-baseline space-x-4">
                    {#each links as link}
                      <a
                        aria-current={link.current ? 'page' : false}
                        href={link.href}
                        class="rounded-md px-3 py-2 text-sm font-medium"
                        class:bg-gray-900={link.current}
                        class:text-white={link.current}
                        class:text-gray-300={!link.current}
                        class:hover:bg-gray-700={!link.current}
                        class:hover:text-white={!link.current}
                      >
                        {link.name}
                      </a>
                    {/each}
                  </nav>
                </div>
              {/if}
            </div>

            <!-- Desktop menu -->
            <div class="hidden md:block">
              <div class="ml-4 flex gap-2 items-center md:ml-6">
                <!-- Theme toggler  -->
                <ThemeModeToggler />

                <!-- Profile dropdown -->
                <UserDropdownMenu user={data.user} />
              </div>
            </div>

            <!-- Mobile Nav -->
            <div class="-mr-2 flex gap-2 md:hidden">
              <!-- Theme toggler  -->
              <ThemeModeToggler />

              <!-- Profile dropdown -->
              <UserDropdownMenu user={data.user} />

              <!-- Menu toggler -->
              <Button
                size="icon"
                aria-controls="mobile-menu"
                aria-expanded={isMobileMenuOpen}
                on:click={() => {
                  isMobileMenuOpen = !isMobileMenuOpen;
                }}
              >
                <span class="sr-only">{isMobileMenuOpen ? 'Close menu' : 'Open menu'}</span>

                {#if isMobileMenuOpen}
                  <div in:fade={{ duration: prefersReducedMotion() ? 0 : 250 }}>
                    <X class="size-6" />
                  </div>
                {:else}
                  <div in:fade={{ duration: prefersReducedMotion() ? 0 : 250 }}>
                    <Menu class="size-6" />
                  </div>
                {/if}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <!-- Mobile menu -->
      {#if isMobileMenuOpen}
        <div class="border-b border-gray-700 md:hidden" id="mobile-menu" transition:scale>
          <nav class="space-y-1 px-2 py-3 sm:px-3">
            {#each links as link}
              <a
                aria-current={link.current ? 'page' : false}
                href={link.href}
                class="block rounded-md px-3 py-2 text-base font-medium"
                class:bg-gray-900={link.current}
                class:text-white={link.current}
                class:text-gray-300={!link.current}
                class:hover:bg-gray-700={!link.current}
                class:hover:text-white={!link.current}
              >
                {link.name}
              </a>
            {/each}
          </nav>
        </div>
      {/if}
    </div>
    <div class="py-10">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 class="text-3xl font-bold tracking-tight text-white">
          {$page.data.title ?? 'Quiz Game'}
        </h1>
      </div>
    </div>
  </header>

  <!-- Main -->
  <main class="-mt-24 flex-grow">
    <div class="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
      <div class="rounded-lg bg-white px-5 py-6 shadow sm:px-6 dark:bg-gray-900">
        <slot />
      </div>
    </div>
  </main>

  <!-- Footer -->
  <footer>
    <div class="mx-auto max-w-3xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
      <div
        class="border-t dark:border-gray-400 border-gray-600 py-8 text-center text-sm text-gray-600 dark:text-gray-400 sm:text-left"
      >
        <span class="block sm:inline">&copy; {new Date().getFullYear()} The Quiz Game, Inc.</span>
        <span class="block sm:inline">All rights reserved.</span>
      </div>
    </div>
  </footer>
</div>
