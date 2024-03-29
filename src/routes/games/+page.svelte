<script lang="ts">
  import Users from 'lucide-svelte/icons/users';
  import { toast } from 'svelte-sonner';
  import { superForm } from 'sveltekit-superforms';
  import { valibotClient } from 'sveltekit-superforms/adapters';

  import Button from '$components/ui/button/button.svelte';
  import Input from '$components/ui/input/input.svelte';
  import Label from '$components/ui/label/label.svelte';
  import Switch from '$components/ui/switch/switch.svelte';
  import Textarea from '$components/ui/textarea/textarea.svelte';
  import { Badge } from '$lib/components/ui/badge';
  import * as Dialog from '$lib/components/ui/dialog';
  import * as Form from '$lib/components/ui/form';
  import * as HoverCard from '$lib/components/ui/hover-card';
  import * as Select from '$lib/components/ui/select';
  import {
    LobbySchema,
    type LobbyInput,
    type LobbyCodeInput,
    LobbyCodeSchema,
  } from '$lib/schemas/lobby';
  import { GameStatus } from '$shared/enums/lobby';
  import { defaultFormOptions } from '$utils/form';

  import type { PageData } from './$types';

  import { PUBLIC_MAX_PLAYERS } from '$env/static/public';

  export let data: PageData;

  const lobbyForm = superForm<LobbyInput>(data.lobbyForm, {
    ...defaultFormOptions,
    validators: valibotClient(LobbySchema),
  });
  const {
    form: lobbyFormData,
    enhance: lobbyEnhance,
    delayed: lobbyDelayed,
    timeout: lobbyTimeout,
  } = lobbyForm;
  const lobbyCodeForm = superForm<LobbyCodeInput>(data.lobbyCodeForm, {
    ...defaultFormOptions,
    onUpdated({ form: updatedForm }) {
      if (!updatedForm.valid) {
        toast.error('No lobby was found with the provided code.');
      }
    },
    validators: valibotClient(LobbyCodeSchema),
  });
  const {
    form: lobbyCodeFormData,
    enhance: lobbyCodeEnhance,
    delayed: lobbyCodeDelayed,
    timeout: lobbyCodeTimeout,
  } = lobbyCodeForm;
  const formattedQuizzes = data.quizzes.map((quiz) => ({ value: quiz.id, label: quiz.title }));
  const formattedFilterQuizzes = [{ value: '', label: 'Any quiz' }, ...formattedQuizzes];
  const statusChoices = [
    { value: '', label: 'Any status' },
    { value: GameStatus.Waiting, label: 'Waiting' },
    { value: GameStatus.InProgress, label: 'In progress' },
  ];

  const selectedFilterStatus =
    statusChoices.find((status) => status.value === data.statusFilter) ?? statusChoices[0];
  const selectedFilterQuiz =
    formattedFilterQuizzes.find((quiz) => quiz.value === data.quizIdFilter) ??
    formattedFilterQuizzes[0];

  $: selectedQuiz = formattedQuizzes.find((quiz) => quiz.value === $lobbyFormData.quizId);
  $: if ($lobbyTimeout || $lobbyCodeTimeout) {
    toast.error('Sorry, this is taking longer than expected...');
  }
</script>

<div class="flex items-center justify-center gap-x-6">
  <Dialog.Root>
    <Dialog.Trigger
      ><div
        class="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        Create a game lobby
      </div></Dialog.Trigger
    >
    <Dialog.Content class="max-h-[90svh] overflow-y-auto">
      <Dialog.Header>
        <Dialog.Title>Create a game lobby</Dialog.Title>
        <Dialog.Description>
          Create a new game lobby to play with friends or random people.
        </Dialog.Description>
      </Dialog.Header>

      <form class="space-y-3" id="lobby_form" method="post" action="?/new" use:lobbyEnhance>
        <Form.Field form={lobbyForm} name="name">
          <Form.Control let:attrs>
            <Form.Label>Name</Form.Label>
            <Input {...attrs} required bind:value={$lobbyFormData.name} />
          </Form.Control>
          <Form.Description />
          <Form.FieldErrors />
        </Form.Field>

        <Form.Field form={lobbyForm} name="description">
          <Form.Control let:attrs>
            <Form.Label>Description</Form.Label>
            <Textarea {...attrs} rows={4} bind:value={$lobbyFormData.description} />
          </Form.Control>
          <Form.Description />
          <Form.FieldErrors />
        </Form.Field>

        <Form.Field
          form={lobbyForm}
          name="randomizeQuestions"
          class="flex flex-row items-center justify-between rounded-lg border p-4"
        >
          <Form.Control let:attrs>
            <div class="space-y-0.5">
              <Form.Label>Randomize questions</Form.Label>
              <Form.Description>Randomize the order of questions in the quiz.</Form.Description>
              <Form.FieldErrors />
            </div>
            <Switch includeInput {...attrs} bind:checked={$lobbyFormData.randomizeQuestions} />
          </Form.Control>
        </Form.Field>

        <Form.Field
          form={lobbyForm}
          name="private"
          class="flex flex-row items-center justify-between rounded-lg border p-4"
        >
          <Form.Control let:attrs>
            <div class="space-y-0.5">
              <Form.Label>Private</Form.Label>
              <Form.Description>
                Private games will not be listed publicly and can only be joined by code.
              </Form.Description>
              <Form.FieldErrors />
            </div>
            <Switch includeInput {...attrs} bind:checked={$lobbyFormData.private} />
          </Form.Control>
        </Form.Field>

        <Form.Field
          form={lobbyForm}
          name="useSingleAnswers"
          class="flex flex-row items-center justify-between rounded-lg border p-4"
        >
          <Form.Control let:attrs>
            <div class="space-y-0.5">
              <Form.Label>Use single answers</Form.Label>
              <Form.Description>
                Whether to allow only one answer per question when the question only has one correct
                answer.
              </Form.Description>
              <Form.FieldErrors />
            </div>
            <Switch includeInput {...attrs} bind:checked={$lobbyFormData.useSingleAnswers} />
          </Form.Control>
        </Form.Field>

        <Form.Field form={lobbyForm} name="password">
          <Form.Control let:attrs>
            <Form.Label>Password</Form.Label>
            <Input
              {...attrs}
              type="password"
              autocomplete="off"
              bind:value={$lobbyFormData.password}
            />
          </Form.Control>
          <Form.Description>Define a password to restrict access to the lobby.</Form.Description>
          <Form.FieldErrors />
        </Form.Field>

        <Form.Field form={lobbyForm} name="quizId">
          <Form.Control let:attrs>
            <Form.Label>Quiz</Form.Label>
            <Select.Root
              selected={selectedQuiz}
              onSelectedChange={(quiz) => {
                if (quiz) {
                  $lobbyFormData.quizId = quiz.value;
                }
              }}
            >
              <Select.Trigger {...attrs}>
                <Select.Value placeholder="Select the quiz to use for this lobby." />
              </Select.Trigger>
              <Select.Content>
                {#each formattedQuizzes as quiz (quiz.value)}
                  <Select.Item value={quiz.value} label={quiz.label} />
                {/each}
              </Select.Content>
            </Select.Root>
            <input hidden bind:value={$lobbyFormData.quizId} name={attrs.name} />
          </Form.Control>
          <Form.Description />
          <Form.FieldErrors />
        </Form.Field>
      </form>

      <Dialog.Footer>
        <Button form="lobby_form" disabled={$lobbyDelayed} type="submit">Create</Button>
      </Dialog.Footer>
    </Dialog.Content>
  </Dialog.Root>

  <Dialog.Root>
    <Dialog.Trigger
      ><div class="text-sm font-semibold leading-6">
        Join a game by code <span aria-hidden="true">→</span>
      </div></Dialog.Trigger
    >
    <Dialog.Content>
      <Dialog.Header>
        <Dialog.Title>Join a game by code</Dialog.Title>
        <Dialog.Description>Enter the code of the lobby you want to join.</Dialog.Description>
      </Dialog.Header>

      <form
        class="space-y-3"
        id="lobby-code_form"
        method="post"
        action="?/joinByCode"
        use:lobbyCodeEnhance
      >
        <Form.Field form={lobbyCodeForm} name="code">
          <Form.Control let:attrs>
            <Form.Label>Code</Form.Label>
            <Input {...attrs} required bind:value={$lobbyCodeFormData.code} />
          </Form.Control>
          <Form.Description />
          <Form.FieldErrors />
        </Form.Field>
      </form>

      <Dialog.Footer>
        <Button form="lobby-code_form" disabled={$lobbyCodeDelayed} type="submit">Join</Button>
      </Dialog.Footer>
    </Dialog.Content>
  </Dialog.Root>
</div>

<form
  class="border-t border-gray-200 mt-6 py-6 dark:border-gray-800"
  method="get"
  novalidate
  data-sveltekit-keepfocus
>
  <fieldset class="flex flex-wrap gap-1.5 items-end">
    <legend class="text-center">Filter</legend>

    <div class="grow">
      <Label for="filter-name">Name</Label>
      <Input name="name" type="text" id="filter-name" />
    </div>

    <Select.Root name="status" selected={selectedFilterStatus}>
      <Select.Trigger class="w-[180px]"><Select.Value placeholder="Status" /></Select.Trigger>
      <Select.Content>
        {#each statusChoices as status}
          <Select.Item value={status.value}>{status.label}</Select.Item>
        {/each}
      </Select.Content>
      <Select.Input />
    </Select.Root>

    <Select.Root name="quizId" selected={selectedFilterQuiz}>
      <Select.Trigger class="w-[180px]"><Select.Value placeholder="Quiz" /></Select.Trigger>
      <Select.Content>
        {#each formattedFilterQuizzes as quiz (quiz.value)}
          <Select.Item value={quiz.value}>{quiz.label}</Select.Item>
        {/each}
      </Select.Content>
      <Select.Input />
    </Select.Root>

    <Button type="submit" aria-controls="lobbies-container" class="h-10">Filter</Button>
  </fieldset>
</form>

<div id="lobbies-container" aria-atomic="true" aria-live="polite">
  {#if data.lobbies.length > 0}
    <ul class="space-y-3">
      {#each data.lobbies as lobby}
        <li
          class="overflow-hidden bg-white shadow sm:rounded-md hover:shadow-lg transition dark:bg-gray-800"
        >
          <HoverCard.Root>
            <HoverCard.Trigger>
              <a
                class="flex justify-between items-center px-4 py-4 sm:px-6"
                href="/games/{lobby.id}"
              >
                <span class="flex font-semibold gap-1.5">
                  <Users />
                  {lobby.playerCount}/{PUBLIC_MAX_PLAYERS}
                </span>
                <span>{lobby.name}</span>
                <Badge>{lobby.status}</Badge>
              </a>
            </HoverCard.Trigger>
            <HoverCard.Content>
              <div class="space-y-3">
                {#if lobby.description}
                  <p><span class="font-semibold">Description : </span>{lobby.description}</p>
                {/if}

                <p><span class="font-semibold">Quizz : </span>{lobby.quiz.title}</p>
              </div>
            </HoverCard.Content>
          </HoverCard.Root>
        </li>
      {/each}
    </ul>
  {:else}
    <p role="status">No lobbies found.</p>
  {/if}
</div>
