<script lang="ts">
  import type { PageData } from './$types';

  export let data: PageData;
</script>

<h1>Quizzes</h1>

<ul>
  {#each data.quizzes as quiz}
    <li>
      <a href={`quizzes/${quiz.id}`}>{quiz.title}</a>
    </li>
  {/each}
</ul>
