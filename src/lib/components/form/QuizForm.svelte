<script lang="ts">
  import { toast } from 'svelte-sonner';
  import { type SuperValidated, superForm } from 'sveltekit-superforms';
  import { valibotClient } from 'sveltekit-superforms/adapters';

  import Button from '$components/ui/button/button.svelte';
  import Switch from '$components/ui/switch/switch.svelte';
  import Textarea from '$components/ui/textarea/textarea.svelte';
  import * as Form from '$lib/components/ui/form';
  import { Input } from '$lib/components/ui/input';
  import * as Select from '$lib/components/ui/select';
  import { QuizSchema, difficultyOptions } from '$lib/schemas/quiz';
  import { defaultFormOptions } from '$utils/form';

  import type { QuizInput } from '$lib/schemas/quiz';

  export let data: SuperValidated<QuizInput>;

  const form = superForm<QuizInput>(data, {
    ...defaultFormOptions,
    validators: valibotClient(QuizSchema),
    invalidateAll: 'force',
    dataType: 'json',
  });
  const { form: formData, errors, timeout, delayed, enhance } = form;

  $: selectedDifficulty = difficultyOptions.find((option) => option.value === $formData.difficulty);
  $: questionErrors = $errors.questions?._errors ?? [];
  $: if ($timeout) {
    toast.error('Sorry, this is taking longer than expected...');
  }

  /**
   * Add a new question to the quiz form.
   */
  const addQuestion = () => {
    if ($formData.questions.length >= 20) {
      return;
    }

    $formData.questions = [
      ...$formData.questions,
      {
        question: '',
        hint: undefined,
        choices: [],
      },
    ];
  };

  /**
   * Remove a question from the quiz form.
   * @param index - The index of the question to remove.
   */
  const removeQuestion = (index: number) => {
    $formData.questions = $formData.questions.filter((_, i) => i !== index);
  };

  /**
   * Add a new choice to a question in the quiz form.
   * @param questionIndex - The index of the question to add the choice to.
   */
  const addChoice = (questionIndex: number) => {
    if ($formData.questions[questionIndex].choices.length >= 5) {
      return;
    }

    $formData.questions[questionIndex].choices = [
      ...$formData.questions[questionIndex].choices,
      {
        label: '',
        isCorrect: false,
      },
    ];
  };

  /**
   * Remove a choice from a question in the quiz form.
   * @param questionIndex - The index of the question to remove the choice from.
   * @param choiceIndex - The index of the choice to remove.
   */
  const removeChoice = (questionIndex: number, choiceIndex: number) => {
    $formData.questions[questionIndex].choices = $formData.questions[questionIndex].choices.filter(
      (_, i) => i !== choiceIndex,
    );
  };
</script>

<form method="post" use:enhance {...$$restProps}>
  <Form.Field {form} name="title">
    <Form.Control let:attrs>
      <Form.Label>Title</Form.Label>
      <Input {...attrs} required bind:value={$formData.title} />
    </Form.Control>
    <Form.Description />
    <Form.FieldErrors />
  </Form.Field>

  <Form.Field {form} name="description">
    <Form.Control let:attrs>
      <Form.Label>Description</Form.Label>
      <Textarea {...attrs} rows={4} bind:value={$formData.description} />
    </Form.Control>
    <Form.Description />
    <Form.FieldErrors />
  </Form.Field>

  <Form.Field {form} name="category">
    <Form.Control let:attrs>
      <Form.Label>Category</Form.Label>
      <Input {...attrs} bind:value={$formData.category} />
    </Form.Control>
    <Form.Description>
      You can add a category to your quiz to help players know what it's about.
    </Form.Description>
    <Form.FieldErrors />
  </Form.Field>

  <Form.Field {form} name="difficulty">
    <Form.Control let:attrs>
      <Form.Label>Difficulty</Form.Label>
      <Select.Root
        selected={selectedDifficulty}
        onSelectedChange={(difficulty) => {
          if (difficulty) {
            $formData.difficulty = difficulty.value;
          }
        }}
      >
        <Select.Trigger {...attrs}>
          <Select.Value placeholder="Select a difficulty for this quiz" />
        </Select.Trigger>
        <Select.Content>
          {#each difficultyOptions as option}
            <Select.Item value={option.value} label={option.label} />
          {/each}
        </Select.Content>
      </Select.Root>
      <input hidden bind:value={$formData.difficulty} name={attrs.name} />
    </Form.Control>
    <Form.Description />
    <Form.FieldErrors />
  </Form.Field>

  <fieldset id="quiz-form_questions" aria-atomic="false" aria-live="polite">
    <legend class:text-destructive={questionErrors.length > 0}>Questions</legend>

    {#if questionErrors.length > 0}
      <ul class="text-sm font-medium text-destructive" role="alert">
        {#each questionErrors as error}
          <li>{error}</li>
        {/each}
      </ul>
    {/if}

    <ul>
      {#each $formData.questions as question, questionIndex}
        {@const questionChoicesContainerId = `quiz-form_question-choices-${questionIndex}`}
        {@const questionChoicesErrors = $errors.questions?.[questionIndex]?.choices?._errors ?? []}

        <li>
          <Form.Field {form} name="questions[{questionIndex}].question">
            <Form.Control let:attrs>
              <Form.Label>Question</Form.Label>
              <Input {...attrs} required bind:value={$formData.questions[questionIndex].question} />
            </Form.Control>
            <Form.Description />
            <Form.FieldErrors />
          </Form.Field>

          <Form.Field {form} name="questions[{questionIndex}].hint">
            <Form.Control let:attrs>
              <Form.Label>Hint</Form.Label>
              <Textarea {...attrs} rows={2} bind:value={$formData.questions[questionIndex].hint} />
            </Form.Control>
            <Form.Description>
              You can add a hint to help players answer the question. It can also be used to give
              more context to the question.
            </Form.Description>
            <Form.FieldErrors />
          </Form.Field>

          {#if $formData.questions[questionIndex].id}
            <input
              hidden
              bind:value={$formData.questions[questionIndex].id}
              name="questions[{questionIndex}].id"
            />
          {/if}

          <Button
            type="button"
            on:click={() => removeQuestion(questionIndex)}
            aria-controls="quiz-form_questions"
          >
            Remove this question ({$formData.questions[questionIndex].question})
          </Button>

          <fieldset id={questionChoicesContainerId} aria-atomic="false" aria-live="polite">
            <legend class:text-destructive={questionChoicesErrors.length > 0}>Choices</legend>

            {#if questionChoicesErrors.length > 0}
              <ul class="text-sm font-medium text-destructive" role="alert">
                {#each questionChoicesErrors as error}
                  <li>{error}</li>
                {/each}
              </ul>
            {/if}

            <ul>
              <!-- eslint-disable-next-line @typescript-eslint/no-unused-vars -->
              {#each question.choices as _, choiceIndex}
                <li>
                  <Form.Field {form} name="questions[{questionIndex}].choices[{choiceIndex}].label">
                    <Form.Control let:attrs>
                      <Form.Label>Choice {choiceIndex + 1}</Form.Label>
                      <Input
                        {...attrs}
                        required
                        bind:value={$formData.questions[questionIndex].choices[choiceIndex].label}
                      />
                    </Form.Control>
                    <Form.Description />
                    <Form.FieldErrors />
                  </Form.Field>

                  <Form.Field
                    {form}
                    name="questions[{questionIndex}].choices[{choiceIndex}].isCorrect"
                    class="flex flex-row items-center justify-between rounded-lg border p-4"
                  >
                    <Form.Control let:attrs>
                      <div class="space-y-0.5">
                        <Form.Label>Is correct?</Form.Label>
                        <Form.Description />
                        <Form.FieldErrors />
                      </div>
                      <Switch
                        includeInput
                        {...attrs}
                        bind:checked={$formData.questions[questionIndex].choices[choiceIndex]
                          .isCorrect}
                      />
                    </Form.Control>
                  </Form.Field>

                  {#if $formData.questions[questionIndex].choices[choiceIndex].id}
                    <input
                      hidden
                      bind:value={$formData.questions[questionIndex].choices[choiceIndex].id}
                      name="questions[{questionIndex}].choices[{choiceIndex}].id"
                    />
                  {/if}

                  <Button
                    type="button"
                    on:click={() => removeChoice(questionIndex, choiceIndex)}
                    aria-controls={questionChoicesContainerId}
                  >
                    Remove this choice ({$formData.questions[questionIndex].choices[choiceIndex]
                      .label})
                  </Button>
                </li>
              {/each}
            </ul>

            <Button
              type="button"
              on:click={() => addChoice(questionIndex)}
              aria-controls={questionChoicesContainerId}
              disabled={$formData.questions[questionIndex].choices.length >= 5}
            >
              Add Choice
            </Button>
          </fieldset>
        </li>
      {/each}
    </ul>

    <Button
      type="button"
      on:click={addQuestion}
      aria-controls="quiz-form_questions"
      disabled={$formData.questions.length >= 20}
    >
      Add Question
    </Button>
  </fieldset>

  <Form.Button disabled={$delayed}>Submit</Form.Button>
</form>
