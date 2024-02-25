<script lang="ts">
  import QuizForm from '$components/form/QuizForm.svelte';
  import * as AlertDialog from '$lib/components/ui/alert-dialog';

  import type { PageData } from './$types';

  import { enhance } from '$app/forms';

  export let data: PageData;
</script>

<QuizForm data={data.form} action="?/edit" />

<form method="post" action="?/delete" use:enhance>
  <AlertDialog.Root>
    <AlertDialog.Trigger>Delete</AlertDialog.Trigger>
    <AlertDialog.Content>
      <AlertDialog.Header>
        <AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
        <AlertDialog.Description>
          This action cannot be undone. Bad things may happen if players are currently using this
          quiz.
        </AlertDialog.Description>
      </AlertDialog.Header>
      <AlertDialog.Footer>
        <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
        <AlertDialog.Action type="submit">Continue</AlertDialog.Action>
      </AlertDialog.Footer>
    </AlertDialog.Content>
  </AlertDialog.Root>
</form>
