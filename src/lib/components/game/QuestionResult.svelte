<script lang="ts">
  import { Check, X } from 'lucide-svelte';

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
  </Card.Content>
</Card.Root>
