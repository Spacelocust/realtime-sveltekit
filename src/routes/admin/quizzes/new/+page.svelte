<script lang="ts">
  import QuizForm from '$components/form/QuizForm.svelte';

  import type { PageData } from './$types';

  export let data: PageData;
</script>

<QuizForm data={data.form} action="?/new" />
