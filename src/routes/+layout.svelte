<script lang="ts">
  import '../app.pcss';

  import { Menu, Moon, MoreHorizontal, Sun, X } from 'lucide-svelte';
  import { ModeWatcher, toggleMode } from 'mode-watcher';

  import { Button } from '$components/ui/button';
  import * as DropdownMenu from '$components/ui/dropdown-menu';
  import { Toaster } from '$components/ui/sonner';

  import type { PageData } from './$types';

  import { onNavigate } from '$app/navigation';
  import { page } from '$app/stores';

  export let data: PageData;

  const links: { name: string; href: string; current: boolean }[] = [
    { name: 'Home', href: '/', current: $page.route.id === '/' },
  ];

  let isMobileMenuOpen = false;

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
<Toaster />

<h1 class="sr-only">{data.title}</h1>
<div class="min-h-full">
  <!-- Nav + Header -->
  <div class="bg-gray-800 pb-32">
    <nav class="bg-gray-800">
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

              <!-- Desktop links -->
              <div class="hidden md:block">
                <div class="ml-10 flex items-baseline space-x-4">
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
                </div>
              </div>
            </div>

            <!-- Desktop menu -->
            <div class="hidden md:block">
              <div class="ml-4 flex gap-2 items-center md:ml-6">
                <!-- Theme toggler  -->
                <Button on:click={toggleMode} size="icon">
                  <span class="sr-only">Toggle theme</span>
                  <Sun
                    class="absolute opacity-100 rotate-0 size-6 transition dark:opacity-0 dark:-rotate-90"
                  />
                  <Moon
                    class="absolute opacity-0 -rotate-90 size-6 transition dark:opacity-100 dark:rotate-0"
                  />
                </Button>

                <!-- Profile dropdown -->
                <DropdownMenu.Root>
                  <DropdownMenu.Trigger asChild let:builder>
                    <Button builders={[builder]} size="icon">
                      <span class="sr-only">Open menu</span>
                      <MoreHorizontal />
                    </Button>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Content>
                    <DropdownMenu.Label>Menu</DropdownMenu.Label>
                    <DropdownMenu.Separator />
                    <DropdownMenu.Group>
                      {#each links as link}
                        <DropdownMenu.Item>
                          <a href={link.href} aria-current={link.current ? 'page' : false}
                            >{link.name}</a
                          >
                        </DropdownMenu.Item>
                      {/each}
                    </DropdownMenu.Group>
                    <DropdownMenu.Separator />
                    <DropdownMenu.Group>
                      {#if data.user}
                        <DropdownMenu.Label>My Account</DropdownMenu.Label>
                        <DropdownMenu.Separator />
                        <DropdownMenu.Item>Logout</DropdownMenu.Item>
                      {:else}
                        <DropdownMenu.Item
                          ><a href="login" class="w-full">Login</a></DropdownMenu.Item
                        >
                      {/if}
                    </DropdownMenu.Group>
                  </DropdownMenu.Content>
                </DropdownMenu.Root>
              </div>
            </div>

            <!-- Mobile Nav -->
            <div class="-mr-2 flex gap-2 md:hidden">
              <!-- Theme toggler  -->
              <Button on:click={toggleMode} size="icon">
                <span class="sr-only">Toggle theme</span>
                <Sun
                  class="absolute opacity-100 rotate-0 size-6 transition dark:opacity-0 dark:-rotate-90"
                />
                <Moon
                  class="absolute opacity-0 -rotate-90 size-6 transition dark:opacity-100 dark:rotate-0"
                />
              </Button>

              <!-- Profile dropdown -->
              <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild let:builder>
                  <Button builders={[builder]} size="icon">
                    <span class="sr-only">Open menu</span>
                    <MoreHorizontal />
                  </Button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content>
                  <DropdownMenu.Label>Menu</DropdownMenu.Label>
                  <DropdownMenu.Separator />
                  <DropdownMenu.Group>
                    {#each links as link}
                      <DropdownMenu.Item>
                        <a href={link.href} aria-current={link.current ? 'page' : false}
                          >{link.name}</a
                        >
                      </DropdownMenu.Item>
                    {/each}
                  </DropdownMenu.Group>
                  <DropdownMenu.Separator />
                  <DropdownMenu.Group>
                    {#if data.user}
                      <DropdownMenu.Label>My Account</DropdownMenu.Label>
                      <DropdownMenu.Separator />
                      <DropdownMenu.Item>Logout</DropdownMenu.Item>
                    {:else}
                      <DropdownMenu.Item><a href="login" class="w-full">Login</a></DropdownMenu.Item
                      >
                    {/if}
                  </DropdownMenu.Group>
                </DropdownMenu.Content>
              </DropdownMenu.Root>

              <!-- Menu toggler -->
              <button
                type="button"
                class="relative inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                aria-controls="mobile-menu"
                aria-expanded={isMobileMenuOpen}
                on:click={() => {
                  isMobileMenuOpen = !isMobileMenuOpen;
                }}
              >
                <span class="absolute -inset-0.5"></span>
                <span class="sr-only">Open main menu</span>

                {#if isMobileMenuOpen}
                  <X class="size-6" />
                {:else}
                  <Menu class="size-6" />
                {/if}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Mobile menu -->
      {#if isMobileMenuOpen}
        <div class="border-b border-gray-700 md:hidden" id="mobile-menu">
          <div class="space-y-1 px-2 py-3 sm:px-3">
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
          </div>
        </div>
      {/if}
    </nav>
    <header class="py-10">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 class="text-3xl font-bold tracking-tight text-white">{$page.data.title}</h1>
      </div>
    </header>
  </div>

  <!-- Main -->
  <main class="-mt-24">
    <div class="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
      <div class="rounded-lg bg-white px-5 py-6 shadow sm:px-6 dark:bg-gray-900">
        <slot />
      </div>
    </div>
  </main>

  <!-- Footer -->
  <footer>
    <div class="mx-auto max-w-3xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
      <div class="border-t border-gray-200 py-8 text-center text-sm text-gray-500 sm:text-left">
        <span class="block sm:inline">&copy; {new Date().getFullYear()} The Quiz Game, Inc.</span>
        <span class="block sm:inline">All rights reserved.</span>
      </div>
    </div>
  </footer>
</div>
