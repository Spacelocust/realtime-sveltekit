<script lang="ts">
  import { toast } from 'svelte-sonner';
  import { superForm } from 'sveltekit-superforms';
  import { valibotClient } from 'sveltekit-superforms/adapters';

  import Input from '$components/ui/input/input.svelte';
  import * as Form from '$lib/components/ui/form';
  import { RegisterSchema, type RegisterInput } from '$lib/schemas/register';
  import { defaultFormOptions } from '$lib/utils/form';

  import type { PageData } from './$types';

  export let data: PageData;

  const form = superForm<RegisterInput>(data.form, {
    ...defaultFormOptions,
    validators: valibotClient(RegisterSchema),
  });
  const { form: formData, enhance, delayed, timeout } = form;

  $: if ($timeout) {
    toast.error('Sorry, this is taking longer than expected...');
  }
</script>

<form action="?/register" method="post" use:enhance>
  <div class="space-y-12">
    <div class="border-b border-gray-900/10 pb-12 dark:border-white/10">
      <h2 class="text-base font-semibold leading-7">Create an account</h2>
      <p class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">
        Create an account and start playing right away!
      </p>
      <div class="mt-10 flex flex-col gap-6">
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
            <Form.Label>Password</Form.Label>
            <Input
              {...attrs}
              type="password"
              autocomplete="new-password"
              bind:value={$formData.password}
            />
          </Form.Control>
          <Form.Description>
            Your password must be at least 8 characters long and contain at least one lowercase
            letter, one uppercase letter and one digit.
          </Form.Description>
          <Form.FieldErrors />
        </Form.Field>

        <Form.Field {form} name="repeatPassword">
          <Form.Control let:attrs>
            <Form.Label>Repeat password</Form.Label>
            <Input
              {...attrs}
              type="password"
              autocomplete="new-password"
              bind:value={$formData.repeatPassword}
            />
          </Form.Control>
          <Form.Description />
          <Form.FieldErrors />
        </Form.Field>
      </div>
    </div>
  </div>
  <div class="mt-6 flex items-center justify-end gap-x-6">
    <a href="login" class="text-sm font-semibold leading-6">Login</a>
    <Form.Button type="submit" disabled={$delayed}>Register</Form.Button>
  </div>
</form>
