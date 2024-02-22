<script>
  import FormRow from '$components/form/FormRow.svelte';
  import Button from '$components/ui/button/button.svelte';
  import Input from '$components/ui/input/input.svelte';
</script>

<form>
  <div class="space-y-12">
    <div class="border-b border-gray-900/10 pb-12 dark:border-white/10">
      <h2 class="text-base font-semibold leading-7">Profile</h2>
      <p class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">
        This information will be displayed publicly so be careful what you share.
      </p>
      <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
        <FormRow id="email" label="Email address">
          <Input id="email" type="email" placeholder="email" slot="input" />
        </FormRow>

        <FormRow id="password" label="Password">
          <Input id="password" placeholder="password" slot="input" type="password" />
        </FormRow>
      </div>
    </div>
  </div>
  <div class="mt-6 flex items-center justify-end gap-x-6">
    <a href="login" class="text-sm font-semibold leading-6">Cancel</a>
    <Button
      type="submit"
      class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:focus-visible:outline-indigo-500"
      >Save</Button
    >
  </div>
</form>
