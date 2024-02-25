<script lang="ts">
  import { Plus } from 'lucide-svelte';

  import Button from '$components/ui/button/button.svelte';

  import type { PageData } from './$types';

  export let data: PageData;
</script>

<div class="text-right">
  <Button aria-label="New Quiz" class="bg-green-500" href="/admin/quizzes/new" size="icon">
    <Plus />
  </Button>
</div>

{#if data.quizzes.length}
  <ul role="list" class="mt-3 space-y-3">
    {#each data.quizzes as quiz (quiz.id)}
      <li class="overflow-hidden bg-white shadow sm:rounded-md hover:shadow-lg transition dark:bg-gray-800">
        <a class="block px-4 py-4 sm:px-6" href="/admin/quizzes/{quiz.id}/edit">{quiz.title}</a>
      </li>
    {/each}
  </ul>
{/if}
