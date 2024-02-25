<script lang="ts">
  import Button from '$components/ui/button/button.svelte';
  import Checkbox from '$components/ui/checkbox/checkbox.svelte';
  import Label from '$components/ui/label/label.svelte';
  import * as Card from '$lib/components/ui/card';
  import * as RadioGroup from '$lib/components/ui/radio-group';

  import type { QuestionWithoutAnswer } from '$socket/types';

  export let question: QuestionWithoutAnswer;
  export let disabled = false;
</script>

<Card.Root class="w-[350px]">
  <Card.Header>
    <Card.Title>{question.question}</Card.Title>
    {#if question.hint}
      <Card.Description>{question.hint}</Card.Description>
    {/if}
  </Card.Header>
  <Card.Content>
    <fieldset {disabled} name="items" class="space-y-0">
      <div class="mb-4">
        <legend>Choices</legend>
        <p class="text-[0.8rem] text-muted-foreground">
          {question.isMultipleChoice
            ? 'This question could have multiple answers.'
            : 'This question has only one correct answer.'}
        </p>
      </div>
      <div class="space-y-2">
        {#if question.isMultipleChoice}
          <div class="flex flex-row items-start space-x-3">
            {#each question.choices as choice (choice.id)}
              <div class="flex items-center space-x-2">
                <Checkbox {disabled} id={choice.id} name="choices[]" value={choice.id} />
                <Label
                  class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  for={choice.id}
                >
                  {choice.label}
                </Label>
              </div>
            {/each}
          </div>
        {:else}
          <RadioGroup.Root {disabled}>
            {#each question.choices as choice (choice.id)}
              <div class="flex items-center space-x-2">
                <RadioGroup.Item value={choice.id} id={choice.id} />
                <Label for={choice.id}>{choice.label}</Label>
              </div>
              <RadioGroup.Input name="choices[]" />
            {/each}
          </RadioGroup.Root>
        {/if}
      </div>
    </fieldset>
  </Card.Content>
  <Card.Footer class="flex justify-end">
    <Button type="submit">Send</Button>
  </Card.Footer>
</Card.Root>
