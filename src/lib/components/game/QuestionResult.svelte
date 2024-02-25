<script lang="ts">
  import Check from 'lucide-svelte/icons/check';
  import X from 'lucide-svelte/icons/x';

  import Progress from '$components/ui/progress/progress.svelte';
  import * as Card from '$lib/components/ui/card';

  import type { QuestionResult, QuestionWithoutAnswer } from '$socket/types';

  export let question: QuestionWithoutAnswer;
  export let results: QuestionResult;

  $: hasGoodAnswers = results.correctAnswers.every((answer) =>
    results.playerAnswers.includes(answer),
  );
</script>

<Card.Root class="w-[350px]">
  <Card.Header>
    <Card.Title>{question.question}</Card.Title>
    {#if question.hint}
      <Card.Description>
        {question.hint}
      </Card.Description>
    {/if}
  </Card.Header>
  <Card.Content>
    <div class="flex flex-col gap-2 justify-center items-center">
      {#if hasGoodAnswers}
        <Check class="w-[50px] h-[50px] text-green-500" />
        <p class="text-green-500">Good job!</p>
      {:else}
        <X class="w-[50px] h-[50px] text-destructive" />
        <p class="text-destructive">You got it wrong</p>
      {/if}
    </div>

    <ul>
      {#each question.choices as choice (choice.id)}
        {@const value = results.countPerAnswer[choice.id] || 0}
        {@const hasAnswered = results.playerAnswers.includes(choice.id)}
        {@const isCorrect = results.correctAnswers.includes(choice.id)}

        <li>
          <Progress {value} max={question.choices.length} />
          <span>{choice.label}</span>
          {#if isCorrect}
            <Check class="w-[20px] h-[20px] text-green-500" />
            <span class="sr-only"
              >This answer is correct{hasAnswered ? ' and you answered it' : ''}</span
            >
          {:else if hasAnswered}
            <X class="w-[20px] h-[20px] text-destructive" />
            <span class="sr-only">This answer is wrong but you answered it</span>
          {/if}
        </li>
      {/each}
    </ul>
  </Card.Content>
</Card.Root>
