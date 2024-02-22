<script lang="ts">
  import FormRow from '$components/form/FormRow.svelte';
  import Logo from '$components/icons/Logo.svelte';
  import Button from '$components/ui/button/button.svelte';
  import { Input } from '$lib/components/ui/input';
</script>

<div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
  <div class="sm:mx-auto sm:w-full sm:max-w-sm">
    <Logo class="mx-auto text-indigo-600 dark:text-indigo-500" />
    <h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight">
      Sign in to your account
    </h2>
  </div>

  <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
    <form class="space-y-6" action="#" method="POST">
      <FormRow id="email" label="Email address">
        <Input id="email" type="email" placeholder="email" slot="input" />
      </FormRow>

      <FormRow id="password" label="Password">
        <div class="text-sm" slot="rightLabel">
          <a
            href="/"
            class="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
            >Forgot password?</a
          >
        </div>
        <Input id="password" placeholder="password" slot="input" type="password" />
      </FormRow>

      <Button type="submit" class="w-full">Sign in</Button>
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
