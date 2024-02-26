<script lang="ts">
  import QuizForm from '$components/form/QuizForm.svelte';
  import * as AlertDialog from '$lib/components/ui/alert-dialog';

  import type { PageData } from './$types';

  import { enhance } from '$app/forms';

  export let data: PageData;
</script>

<QuizForm data={data.form} action="?/edit" />

<form id="quiz_delete-form" method="post" action="?/delete" use:enhance></form>

<AlertDialog.Root>
  <AlertDialog.Trigger>
    <span class="font-semibold text-red-500">Delete quiz</span>
  </AlertDialog.Trigger>
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
      <AlertDialog.Action type="submit" form="quiz_delete-form">Continue</AlertDialog.Action>
    </AlertDialog.Footer>
  </AlertDialog.Content>
</AlertDialog.Root>
