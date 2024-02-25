<script lang="ts">
  import Plus from 'lucide-svelte/icons/plus';

  import Button from '$components/ui/button/button.svelte';
  import { Badge } from '$lib/components/ui/badge';
  import * as HoverCard from '$lib/components/ui/hover-card';

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
      <li
        class="overflow-hidden bg-white shadow sm:rounded-md hover:shadow-lg transition dark:bg-gray-800"
      >
        <HoverCard.Root>
          <HoverCard.Trigger>
            <a
              class="flex justify-between items-center px-4 py-4 sm:px-6"
              href="/admin/quizzes/{quiz.id}/edit"
            >
              <span class="font-semibold">
                {quiz.questionsCount} question{quiz.questionsCount > 1 ? 's' : ''}</span
              >
              <span>{quiz.title}</span>
              <Badge>{quiz.difficulty}</Badge>
            </a>
          </HoverCard.Trigger>
          <HoverCard.Content>
            <div class="space-y-3">
              <p><span class="font-semibold">Description : </span>{quiz.description}</p>
              <p><span class="font-semibold">Category : </span>{quiz.category}</p>
            </div>
          </HoverCard.Content>
        </HoverCard.Root>
      </li>
    {/each}
  </ul>
{/if}
