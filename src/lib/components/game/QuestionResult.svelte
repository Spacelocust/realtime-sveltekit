<script lang="ts">
  import Check from 'lucide-svelte/icons/check';
  import X from 'lucide-svelte/icons/x';

  import Progress from '$components/ui/progress/progress.svelte';
  import * as Card from '$lib/components/ui/card';

  import type { QuestionResult, QuestionWithoutAnswer } from '$socket/types';

  export let question: QuestionWithoutAnswer;
  export let results: QuestionResult;
  export let playerCount: number;

  $: hasGoodAnswers = results.correctAnswers.every((answer) =>
    results.playerAnswers.includes(answer),
  );
</script>

<Card.Root>
  <Card.Header>
    <Card.Title>{question.question}</Card.Title>
    {#if question.hint}
      <Card.Description>
        {question.hint}
      </Card.Description>
    {/if}
  </Card.Header>
  <Card.Content>
    <div class="flex flex-col gap-1.5 justify-center items-center">
      {#if hasGoodAnswers}
        <Check class="size-12 text-green-500" />
        <p class="text-green-500">Good job!</p>
      {:else}
        <X class="size-12 text-red-500" />
        <p class="text-red-500">You got it wrong</p>
      {/if}
    </div>

    <ul class="mt-3">
      {#each question.choices as choice (choice.id)}
        {@const value = results.countPerAnswer[choice.id] || 0}
        {@const hasAnswered = results.playerAnswers.includes(choice.id)}
        {@const isCorrect = results.correctAnswers.includes(choice.id)}

        <li>
          <span class="min-w-max">{choice.label}</span>

          <div class="flex gap-1.5 items-center">
            {#if isCorrect}
              <Check class="size-6 text-green-500" />
              <span class="sr-only"
                >This answer is correct{hasAnswered ? ' and you answered it' : ''}</span
              >
            {:else if hasAnswered}
              <X class="size-6 text-red-500" />
              <span class="sr-only">This answer is wrong but you answered it</span>
            {/if}

            <Progress {value} max={playerCount} />
          </div>
        </li>
      {/each}
    </ul>
  </Card.Content>
</Card.Root>
