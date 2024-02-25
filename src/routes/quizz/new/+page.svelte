<script lang="ts">
  import { Plus } from 'lucide-svelte';
  import { superForm } from 'sveltekit-superforms';
  import { valibotClient } from 'sveltekit-superforms/adapters';

  import Button from '$components/ui/button/button.svelte';
  import Input from '$components/ui/input/input.svelte';
  import { Checkbox } from '$lib/components/ui/checkbox';
  import * as Form from '$lib/components/ui/form';
  import { Label } from '$lib/components/ui/label';
  import { QuizzSchema } from '$lib/schemas/quizz';
  import { defaultFormOptions } from '$lib/utils/form';

  import type { PageData } from './$types';

  export let data: PageData;

  const form = superForm(data.form, {
    ...defaultFormOptions,
    validators: valibotClient(QuizzSchema),
  });

  type Answer = {
    correct: boolean;
    label: string;
    multiple: boolean;
  };

  type Question = {
    answers: Answer[];
    label: string;
  };

  let questions: Question[] = [];

  const addAnswer = (question: Question) => {
    questions = questions.map((q) => {
      if (q === question) {
        q.answers = [...q.answers, { correct: false, label: '', multiple: false }];
      }

      return q;
    });
  };

  const addQuestion = () => {
    questions = [...questions, { answers: [], label: '' }];
  };
</script>

<form>
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
              <Form.Field {form} name="name">
                <Form.Control let:attrs>
                  <Form.Label>Name</Form.Label>
                  <Input {...attrs} autocomplete="name" />
                </Form.Control>
                <Form.Description />
                <Form.FieldErrors />
              </Form.Field>
            </div>
            <div class="col-span-full">
              <Form.Field {form} name="difficulty">
                <Form.Control let:attrs>
                  <Form.Label>Difficulty</Form.Label>
                  <Input {...attrs} autocomplete="difficulty" placeholder="Easy" />
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
        <h2 class="text-base font-semibold leading-7">Questions</h2>
        <p class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">
          All the questions in the quizz.
        </p>
      </div>
      <div
        class="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2 dark:bg-gray-900 dark:ring-white/10"
      >
        <div class="grid gap-y-8 px-4 py-6 sm:p-8">
          {#each questions as question, questionIndex}
            <div class="px-4 py-6 sm:p-8 shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl dark:ring-white/10">
              <div class="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div class="col-span-full">
                  <Form.Field {form} name="label">
                    <Form.Control let:attrs>
                      <Form.Label>Question {questionIndex + 1}</Form.Label>
                      <Input {...attrs} autocomplete="name" />
                    </Form.Control>
                    <Form.Description />
                    <Form.FieldErrors />
                  </Form.Field>

                  <div class="items-top flex space-x-2">
                    <Checkbox id={`is-multiple-${questionIndex}`} />
                    <div class="grid gap-1.5 leading-none">
                      <Label
                        for={`is-multiple-${questionIndex}`}
                        class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Is multiple
                      </Label>
                    </div>
                  </div>
                </div>
              </div>

              {#if question.answers.length}
                <div class="grid gap-y-8 px-4 py-6 sm:p-8">
                  {#each question.answers as answer, answerIndex}
                    <div class="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                      <div class="col-span-full">
                        <Form.Field {form} name="label">
                          <Form.Control let:attrs>
                            <Form.Label>Answer {answerIndex + 1}</Form.Label>
                            <Input {...attrs} autocomplete="name" />
                          </Form.Control>
                          <Form.Description />
                          <Form.FieldErrors />
                        </Form.Field>

                        <div class="items-top flex space-x-2">
                          <Checkbox id={`is-correct-${answerIndex}`} />
                          <div class="grid gap-1.5 leading-none">
                            <Label
                              for={`is-correct-${answerIndex}`}
                              class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Is correct
                            </Label>
                          </div>
                        </div>
                      </div>
                    </div>
                  {/each}
                </div>
              {/if}

              <div class="text-center">
                <Button on:click={() => addAnswer(question)} size="">
                  <Plus />
                </Button>
              </div>
            </div>
          {/each}

          <div class="text-center">
            <Button on:click={addQuestion} size="icon">
              <Plus />
            </Button>
          </div>
        </div>
      </div>
    </section>
  </div>
  <div class="mt-6 flex items-center justify-end gap-x-6">
    <Button type="submit">Save</Button>
  </div>
</form>
