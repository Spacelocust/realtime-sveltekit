<script lang="ts">
  import { toast } from 'svelte-sonner';
  import { superForm } from 'sveltekit-superforms';
  import { valibotClient } from 'sveltekit-superforms/adapters';

  import Logo from '$components/icons/Logo.svelte';
  import * as Form from '$lib/components/ui/form';
  import { Input } from '$lib/components/ui/input';
  import { LoginSchema, type LoginInput } from '$lib/schemas/login';
  import { defaultFormOptions } from '$lib/utils/form';

  import type { PageData } from './$types';

  export let data: PageData;

  const form = superForm<LoginInput>(data.form, {
    ...defaultFormOptions,
    validators: valibotClient(LoginSchema),
  });
  const { form: formData, enhance, delayed, timeout } = form;

  $: if ($timeout) {
    toast.error('Sorry, this is taking longer than expected...');
  }
</script>

<div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
  <div class="sm:mx-auto sm:w-full sm:max-w-sm">
    <Logo class="mx-auto text-indigo-600 dark:text-indigo-500" />
    <h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight">
      Sign in to your account
    </h2>
  </div>

  <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
    <form class="space-y-6" action="?/login" method="post" use:enhance>
      <Form.Field {form} name="username">
        <Form.Control let:attrs>
          <Form.Label>Username</Form.Label>
          <Input {...attrs} autocomplete="username" bind:value={$formData.username} />
        </Form.Control>
        <Form.Description />
        <Form.FieldErrors />
      </Form.Field>

      <Form.Field {form} name="password">
        <Form.Control let:attrs>
          <div class="flex items-center justify-between">
            <Form.Label>Password</Form.Label>

            <button
              type="button"
              on:click={() => {
                toast.info(
                  "That's a bummer, but we don't have a password recovery feature yet... Sorry!",
                );
              }}
              class="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 text-sm"
              >Forgot password?</button
            >
          </div>
          <Input
            {...attrs}
            type="password"
            autocomplete="current-password"
            bind:value={$formData.password}
          />
        </Form.Control>
        <Form.Description />
        <Form.FieldErrors />
      </Form.Field>

      <Form.Button type="submit" class="w-full" disabled={$delayed}>Sign in</Form.Button>
    </form>

    <p class="mt-10 text-center text-sm text-gray-500 dark:text-gray-400">
      Not a member?
      <a
        href="/register"
        class="font-semibold leading-6 text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
        >Register</a
      >
    </p>
  </div>
</div>
