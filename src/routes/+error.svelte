<script lang="ts">
  import { page } from '$app/stores';

  $: errorTitle =
    {
      401: 'Access denied',
      404: 'Page not found',
      500: 'Internal server error',
    }[$page.status] ?? 'Something went wrong';
</script>

<svelte:head>
  <title>{errorTitle} - {$page.status}</title>
  <meta name="description" content={$page.error?.message ?? 'Something went wrong.'} />
  <meta name="robots" content="noindex" />
  <meta name="googlebot" content="noindex" />
</svelte:head>

<div class="text-center">
  <p class="text-base font-semibold text-indigo-600">{$page.status}</p>
  <h1 class="mt-4 text-3xl font-bold tracking-tight sm:text-5xl">{errorTitle}</h1>
  <p class="mt-6 text-base leading-7 text-gray-600">
    {$page.error?.message ?? 'Something went wrong.'}
  </p>
  <div class="mt-10 flex items-center justify-center gap-x-6">
    <a
      href="/"
      class="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >Go back home</a
    >
  </div>
</div>
