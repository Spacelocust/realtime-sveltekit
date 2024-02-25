<script lang="ts">
  import type { PageData } from './$types';

  export let data: PageData;
</script>

<a href="/admin/quizzes/new">New Quiz</a>

<ul>
  {#each data.quizzes as quiz (quiz.id)}
    <li>
      <a href="/admin/quizzes/{quiz.id}/edit">{quiz.title}</a>
    </li>
  {/each}
</ul>
