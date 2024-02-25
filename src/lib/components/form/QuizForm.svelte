<script lang="ts">
  import { Plus, Trash2 } from 'lucide-svelte';
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
  <div class="space-y-10 divide-y divide-gray-900/10 dark:divide-white/10">
    <section class="grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-3">
      <div class="px-4 sm:px-0">
        <h2 class="text-base font-semibold leading-7">General</h2>
        <p class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">
          General information about the quizz.
        </p>
      </div>
      <div
        class="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2 dark:bg-gray-900 dark:ring-white/10"
      >
        <div class="px-4 py-6 sm:p-8">
          <div class="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div class="col-span-full">
              <Form.Field {form} name="title">
                <Form.Control let:attrs>
                  <Form.Label>Title</Form.Label>
                  <Input {...attrs} required bind:value={$formData.title} />
                </Form.Control>
                <Form.Description />
                <Form.FieldErrors />
              </Form.Field>
            </div>
            <div class="col-span-full">
              <Form.Field {form} name="description">
                <Form.Control let:attrs>
                  <Form.Label>Description</Form.Label>
                  <Textarea {...attrs} rows={4} bind:value={$formData.description} />
                </Form.Control>
                <Form.Description />
                <Form.FieldErrors />
              </Form.Field>
            </div>
            <div class="col-span-full">
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
            </div>
            <div class="col-span-full">
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
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="grid grid-cols-1 gap-x-8 gap-y-8 pt-10 md:grid-cols-3">
      <div class="px-4 sm:px-0">
        <h2
          class="text-base font-semibold leading-7"
          class:text-red-500={questionErrors.length > 0}
        >
          Questions
        </h2>
        <p class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">
          All the questions in the quizz.
        </p>

        {#if questionErrors.length > 0}
          <ul class="text-sm font-medium text-red-500" role="alert">
            {#each questionErrors as error}
              <li>{error}</li>
            {/each}
          </ul>
        {/if}
      </div>
      <div
        class="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2 dark:bg-gray-900 dark:ring-white/10"
      >
        <fieldset
          aria-atomic="false"
          aria-live="polite"
          class="grid gap-y-8 px-4 py-6 sm:p-8"
          id="quiz-form_questions"
        >
          {#if $formData.questions.length}
            <ul class="contents">
              {#each $formData.questions as question, questionIndex}
                {@const questionChoicesContainerId = `quiz-form_question-choices-${questionIndex}`}
                {@const questionChoicesErrors =
                  $errors.questions?.[questionIndex]?.choices?._errors ?? []}

                <li>
                  {#if $formData.questions[questionIndex].id}
                    <input
                      hidden
                      bind:value={$formData.questions[questionIndex].id}
                      name="questions[{questionIndex}].id"
                    />
                  {/if}

                  <div
                    class="grid gap-y-8 px-4 py-6 sm:p-8 shadow-sm ring-1 ring-gray-900/5 relative sm:rounded-xl dark:ring-white/10"
                  >
                    <Button
                      aria-controls="quiz-form_questions"
                      aria-label={`Remove this question (${$formData.questions[questionIndex].question})`}
                      class="absolute right-2 top-2"
                      size="icon"
                      type="button"
                      variant="destructive"
                      on:click={() => removeQuestion(questionIndex)}
                    >
                      <Trash2 />
                    </Button>

                    <div class="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                      <div class="col-span-full">
                        <Form.Field {form} name="questions[{questionIndex}].question">
                          <Form.Control let:attrs>
                            <Form.Label>Question</Form.Label>
                            <Input
                              {...attrs}
                              required
                              bind:value={$formData.questions[questionIndex].question}
                            />
                          </Form.Control>
                          <Form.Description />
                          <Form.FieldErrors />
                        </Form.Field>

                        <Form.Field {form} name="questions[{questionIndex}].hint">
                          <Form.Control let:attrs>
                            <Form.Label>Hint</Form.Label>
                            <Textarea
                              {...attrs}
                              rows={2}
                              bind:value={$formData.questions[questionIndex].hint}
                            />
                          </Form.Control>
                          <Form.Description>
                            You can add a hint to help players answer the question. It can also be
                            used to give more context to the question.
                          </Form.Description>
                          <Form.FieldErrors />
                        </Form.Field>
                      </div>
                    </div>
                    <fieldset
                      aria-atomic="false"
                      aria-live="polite"
                      id={questionChoicesContainerId}
                    >
                      <legend class:text-red-500={questionChoicesErrors.length > 0}>Choices</legend>

                      {#if questionChoicesErrors.length > 0}
                        <ul class="text-sm font-medium text-red-500" role="alert">
                          {#each questionChoicesErrors as error}
                            <li>{error}</li>
                          {/each}
                        </ul>
                      {/if}

                      {#if question.choices.length}
                        <ul class="grid gap-y-8 px-4 py-6 sm:p-8">
                          <!-- eslint-disable-next-line @typescript-eslint/no-unused-vars -->
                          {#each question.choices as _, choiceIndex}
                            <li class="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                              <div class="col-span-full relative">
                                <Button
                                  aria-controls={questionChoicesContainerId}
                                  aria-label={`Remove this choice (${$formData.questions[questionIndex].choices[choiceIndex].label})`}
                                  class="absolute right-0 size-7 top-0"
                                  size=""
                                  type="button"
                                  variant="destructive"
                                  on:click={() => removeChoice(questionIndex, choiceIndex)}
                                >
                                  <Trash2 class="size-5" />
                                </Button>

                                <Form.Field
                                  {form}
                                  name="questions[{questionIndex}].choices[{choiceIndex}].label"
                                >
                                  <Form.Control let:attrs>
                                    <Form.Label>Choice {choiceIndex + 1}</Form.Label>
                                    <Input
                                      {...attrs}
                                      required
                                      bind:value={$formData.questions[questionIndex].choices[
                                        choiceIndex
                                      ].label}
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
                                    </div>
                                    <Switch
                                      includeInput
                                      {...attrs}
                                      bind:checked={$formData.questions[questionIndex].choices[
                                        choiceIndex
                                      ].isCorrect}
                                    />
                                  </Form.Control>
                                </Form.Field>

                                {#if $formData.questions[questionIndex].choices[choiceIndex].id}
                                  <input
                                    hidden
                                    bind:value={$formData.questions[questionIndex].choices[
                                      choiceIndex
                                    ].id}
                                    name="questions[{questionIndex}].choices[{choiceIndex}].id"
                                  />
                                {/if}
                              </div>
                            </li>
                          {/each}
                        </ul>
                      {/if}
                    </fieldset>

                    <div class="text-center">
                      <Button
                        aria-controls={questionChoicesContainerId}
                        aria-label="Add choice"
                        disabled={$formData.questions[questionIndex].choices.length >= 5}
                        size=""
                        type="button"
                        on:click={() => addChoice(questionIndex)}
                      >
                        <Plus />
                      </Button>
                    </div>
                  </div>
                </li>
              {/each}
            </ul>
          {/if}

          <div class="text-center">
            <Button
              aria-controls="quiz-form_questions"
              aria-label="Add question"
              disabled={$formData.questions.length >= 20}
              size="icon"
              type="button"
              on:click={addQuestion}
            >
              <Plus />
            </Button>
          </div>
        </fieldset>
      </div>
    </section>
  </div>
  <div class="mt-6 flex items-center justify-end gap-x-6">
    <Form.Button disabled={$delayed}>Submit</Form.Button>
  </div>
</form>
