<script lang="ts">
  import '../app.pcss';

  import { ModeWatcher, toggleMode } from 'mode-watcher';
  import { Moon, Person, Sun, DotsHorizontal } from 'radix-icons-svelte';

  import { Button } from '$components/ui/button';
  import * as DropdownMenu from '$components/ui/dropdown-menu';
  import { Toaster } from '$components/ui/sonner';

  import type { PageData } from './$types';

  import { enhance } from '$app/forms';
  import { onNavigate } from '$app/navigation';
  import { page } from '$app/stores';

  export let data: PageData;

  const links: { name: string; href: string; current: boolean }[] = [
    { name: 'Home', href: '/', current: $page.route.id === '/' },
  ];

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

<div class="min-h-full flex flex-col">
  <h1 class="sr-only">{data.title}</h1>

  <header class="bg-indigo-600 pb-24">
    <div class="mx-auto max-w-3xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
      <div class="relative flex items-center justify-center py-5 lg:justify-between">
        <!-- Logo -->
        <div class="absolute left-0 flex-shrink-0 lg:static">
          <a href="/">
            <span class="sr-only">Quiz Game Homepage</span>
            <img
              class="h-8 w-auto"
              src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=300"
              alt="Quiz Game logo"
            />
          </a>
        </div>

        <!-- Right section on desktop -->
        <div class="hidden lg:ml-4 lg:flex lg:items-center lg:pr-0.5 gap-4">
          <Button on:click={toggleMode} variant="outline" size="icon">
            <Sun
              class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
            />
            <Moon
              class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
            />
            <span class="sr-only">Toggle theme</span>
          </Button>

          <!-- Profile dropdown -->
          <div class="relative flex-shrink-0">
            <div>
              <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild let:builder>
                  <Button builders={[builder]} variant="outline" size="icon">
                    <span class="sr-only">Open user menu</span>
                    <Person class="h-6 w-6" />
                  </Button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content>
                  <DropdownMenu.Label>My Account</DropdownMenu.Label>
                  <DropdownMenu.Separator />
                  <DropdownMenu.Group>
                    {#if data.user}
                      <DropdownMenu.Item>
                        <form method="post" action="/?/logout" use:enhance>
                          <button type="submit">Sign out</button>
                        </form>
                      </DropdownMenu.Item>
                    {:else}
                      <DropdownMenu.Item>
                        <a href="/login">Login</a>
                      </DropdownMenu.Item>
                    {/if}
                  </DropdownMenu.Group>
                </DropdownMenu.Content>
              </DropdownMenu.Root>
            </div>
          </div>
        </div>

        <!-- Title -->
        <div class="min-w-0 flex-1 px-12 lg:hidden">
          <div class="mx-auto w-full max-w-xs">
            <p class="text-2xl font-bold text-white">{$page.data.title}</p>
          </div>
        </div>

        <!-- Menu button -->
        <div class="absolute right-0 flex-shrink-0 lg:hidden flex items-center gap-2">
          <Button on:click={toggleMode} variant="outline" size="icon">
            <Sun
              class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
            />
            <Moon
              class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
            />
            <span class="sr-only">Toggle theme</span>
          </Button>

          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild let:builder>
              <Button builders={[builder]} variant="outline" size="icon">
                <span class="sr-only">Open menu</span>
                <DotsHorizontal class="h-6 w-6" />
              </Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content>
              <DropdownMenu.Label>Menu</DropdownMenu.Label>
              <DropdownMenu.Separator />
              <DropdownMenu.Group>
                {#each links as link}
                  <DropdownMenu.Item>
                    <a href={link.href} aria-current={link.current ? 'page' : false}>{link.name}</a>
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
                  <DropdownMenu.Item>Login</DropdownMenu.Item>
                {/if}
              </DropdownMenu.Group>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        </div>
      </div>
      <div class="hidden border-t border-white border-opacity-20 py-5 lg:block">
        <div class="grid grid-cols-3 items-center gap-8">
          <div class="col-span-2">
            <nav class="flex space-x-4">
              {#each links as link}
                <a
                  href={link.href}
                  class="rounded-md bg-white bg-opacity-0 px-3 py-2 text-sm font-medium hover:bg-opacity-10"
                  class:text-white={link.current}
                  class:text-indigo-100={!link.current}
                  aria-current={link.current ? 'page' : false}>{link.name}</a
                >
              {/each}
            </nav>
          </div>
          <div>
            <div class="mx-auto w-full max-w-md">
              <p class="text-2xl font-bold text-white text-right">{$page.data.title}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
  <main class="-mt-24 pb-8 flex-grow">
    <div class="mx-auto max-w-3xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
      <slot />
    </div>
  </main>
  <footer>
    <div class="mx-auto max-w-3xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
      <div
        class="border-t border-gray-200 py-8 text-center text-sm text-gray-500 dark:text-gray-200 sm:text-left"
      >
        <span class="block sm:inline">&copy; {new Date().getFullYear()} The Quiz Game, Inc.</span>
        <span class="block sm:inline">All rights reserved.</span>
      </div>
    </div>
  </footer>
</div>
