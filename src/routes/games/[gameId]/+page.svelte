<script lang="ts">
  import Loader2 from 'lucide-svelte/icons/loader-2';
  import { io } from 'socket.io-client';
  import { onDestroy, onMount } from 'svelte';
  import { toast } from 'svelte-sonner';

  import QuestionForm from '$components/game/QuestionForm.svelte';
  import QuestionResult from '$components/game/QuestionResult.svelte';
  import Scoreboard from '$components/game/Scoreboard.svelte';
  import Button from '$components/ui/button/button.svelte';
  import Input from '$components/ui/input/input.svelte';
  import * as AlertDialog from '$lib/components/ui/alert-dialog';
  import { GameStatus } from '$shared/enums/lobby';
  import { MessageType } from '$shared/enums/socket';
  import { formatOrdinals } from '$utils/ordinal';

  import type {
    Player,
    QuestionResult as QuestionResultType,
    QuestionWithoutAnswer,
  } from '$socket/types';
  import type { Socket } from '$types/socket';
  import type { PageData } from './$types';

  import { goto } from '$app/navigation';
  import { PUBLIC_HOST } from '$env/static/public';

  export let data: PageData;

  /**
   * The socket connection to the server
   */
  let socket: Socket;
  /**
   * Will be false until the socket is connected
   */
  let socketIsReady = false;
  /**
   * Will be true after the socket is connected if the lobby has a password
   */
  let showLobbyPasswordPrompt = false;
  /**
   * The list of connected players with their username and id
   */
  let players: Player[] = [];
  /**
   * The current question being asked
   */
  let currentQuestion: QuestionWithoutAnswer | null = null;
  /**
   * The result of the current question
   */
  let currentQuestionResult: QuestionResultType | null = null;
  /**
   * The history of questions and their results
   */
  let questionResults: { question: QuestionWithoutAnswer; results: QuestionResultType }[] = [];
  /**
   * The status of the game lobby
   */
  let gameStatus = data.gameLobby.status;
  /**
   * The type of timer currently running
   */
  let timerType: 'question' | 'interlude' = 'question';
  /**
   * The time remaining on the current timer
   */
  let timer: number | null = null;
  /**
   * Whether the player has answered the current question
   */
  let hasAnsweredCurrentQuestion = false;

  /**
   * The position of the player in the scoreboard
   */
  $: currentPosition = players.findIndex((player) => player.id === data.userId) + 1;

  /**
   * When the player submits the password form
   */
  const onPasswordSubmit = (
    e: SubmitEvent & {
      currentTarget: EventTarget & HTMLFormElement;
    },
  ) => {
    const formData = new FormData(e.currentTarget);
    const password = (formData.get('password') ?? '') as string;

    socket.emit('join', data.gameLobby.id, password);
  };

  /**
   * When the player starts the game
   */
  const startGame = () => {
    socket.emit('start');
  };

  /**
   * When the player submits the question form
   */
  const onQuestionSubmit = (
    e: SubmitEvent & {
      currentTarget: EventTarget & HTMLFormElement;
    },
  ) => {
    const formData = new FormData(e.currentTarget);
    const choices = formData.getAll('choices[]');

    socket.emit(
      'answer',
      choices.map((choice) => choice.toString()),
    );
  };

  onMount(() => {
    socket = io(PUBLIC_HOST);

    // When the socket is connected
    socket.on('connect', () => {
      socketIsReady = true;

      // If the lobby has a password, prompt the user for it
      if (data.hasPassword) {
        showLobbyPasswordPrompt = true;
      } else {
        // Otherwise, join the lobby
        socket.emit('join', data.gameLobby.id);
      }
    });

    // When the socket encounters an error that closes the connection
    socket.on('connect_error', (err) => {
      toast.error(err.message);

      goto('/games');
    });

    // When the socket is disconnected
    socket.on('disconnect', () => {
      goto('/games');
    });

    // When the list of players is updated (will also be triggered when the player joins the lobby)
    socket.on('players', (updatedPlayers) => {
      showLobbyPasswordPrompt = false;
      players = updatedPlayers.sort((a, b) => b.score - a.score);
    });

    // When a new question is asked
    socket.on('question', (question) => {
      currentQuestion = question;
      currentQuestionResult = null;
      hasAnsweredCurrentQuestion = false;
    });

    // When the player has answered the current question (and it is valid)
    socket.on('answered', () => {
      hasAnsweredCurrentQuestion = true;
    });

    // When the current question cannot be answered anymore (interlude started)
    socket.on('questionResult', (result) => {
      currentQuestionResult = result;

      if (currentQuestion) {
        questionResults = [...questionResults, { question: currentQuestion, results: result }];
      }
    });

    // When the game status is updated
    socket.on('lobbyStatus', (status) => {
      gameStatus = status;
    });

    // When the answer timer is updated
    socket.on('answerTimer', (time) => {
      timerType = 'question';
      timer = time;
    });

    // When the interlude timer is updated
    socket.on('interludeTimer', (time) => {
      timerType = 'interlude';
      timer = time;
    });

    // When the socket receives a message (an information to display to the player)
    socket.on('message', (arg) => {
      if (arg.type === MessageType.Error) {
        toast.error(arg.content);
      } else {
        toast.info(arg.content);
      }
    });
  });

  onDestroy(() => {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (socket) {
      socket.disconnect();
    }
  });
</script>

<AlertDialog.Root
  bind:open={showLobbyPasswordPrompt}
  closeOnEscape={false}
  closeOnOutsideClick={false}
>
  <AlertDialog.Trigger />
  <AlertDialog.Content>
    <AlertDialog.Header>
      <AlertDialog.Title>This lobby requires a password</AlertDialog.Title>
      <AlertDialog.Description>
        The lobby you are trying to join requires a password. Please enter the password to continue.
      </AlertDialog.Description>
    </AlertDialog.Header>

    <form id="lobby-password" method="post" on:submit|preventDefault={onPasswordSubmit}>
      <Input type="password" name="password" aria-label="Lobby password" />
    </form>

    <AlertDialog.Footer>
      <AlertDialog.Cancel
        on:click={() => {
          socket.disconnect();
        }}>Cancel</AlertDialog.Cancel
      >
      <Button type="submit" form="lobby-password">Join</Button>
    </AlertDialog.Footer>
  </AlertDialog.Content>
</AlertDialog.Root>

<div
  id="game-container"
  aria-atomic="false"
  aria-live="polite"
  aria-busy={!socketIsReady ? 'true' : undefined}
>
  {#if !socketIsReady || showLobbyPasswordPrompt}
    <Loader2 class="animate-spin" />
    <span class="sr-only" role="status">Connecting to game... This could take a moment.</span>
  {:else}
    <Scoreboard {players} />

    <h2>Game !</h2>

    {#if gameStatus === GameStatus.Waiting}
      <!-- Waiting view -->
      {#if data.isHost}
        <Button on:click={startGame}>Start game</Button>
      {:else}
        <p role="status" aria-live="polite">Waiting for the host to start the game...</p>
      {/if}
    {:else if gameStatus === GameStatus.InProgress}
      {#if timer}
        <p role="status" aria-live="polite">
          {#if timerType === 'question'}
            Time remaining to answer: {timer} second{timer <= 1 ? '' : 's'}
          {:else}
            Time remaining until next question: {timer} second{timer <= 1 ? '' : 's'}
          {/if}
        </p>
      {/if}

      <!-- In progress view -->
      {#if currentQuestion}
        {#if timerType === 'question'}
          <!-- Question view -->
          <form method="post" on:submit|preventDefault={onQuestionSubmit}>
            <QuestionForm disabled={hasAnsweredCurrentQuestion} question={currentQuestion} />
          </form>
        {:else}
          <!-- Interlude view -->
          {#if currentQuestionResult}
            <QuestionResult question={currentQuestion} results={currentQuestionResult} />
          {:else}
            <p role="status" aria-live="polite">Waiting for the next question...</p>
          {/if}
        {/if}
      {:else}
        <!-- Waiting for the next question view -->
        <p role="status" aria-live="polite">Waiting for the next question...</p>
      {/if}
    {:else}
      <!-- Ended view -->
      <p role="status" aria-live="polite">
        The game has ended. You scored {players[currentPosition - 1].score} points and finished in {formatOrdinals(
          currentPosition,
        )} place.
      </p>
      <Button href="/games">Return to games</Button>

      <section>
        <h3>Your results</h3>

        <ul>
          {#each questionResults as { question, results } (question.id)}
            <li>
              <QuestionResult {question} {results} />
            </li>
          {/each}
        </ul>
      </section>
    {/if}
  {/if}
</div>
