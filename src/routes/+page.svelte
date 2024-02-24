<script lang="ts">
  import { io } from 'socket.io-client';

  import type { PageData } from './$types';

  import { browser } from '$app/environment';
  import { PUBLIC_HOST } from '$env/static/public';

  let connecting = true;
  let connected = false;

  let messages: string[] = [];

  export let data: PageData;

  if (browser) {
    console.log('in browser');

    const socket = io(PUBLIC_HOST, {
      extraHeaders: {
        Authorization: `Bearer ${data.sessionId}`,
      },
    });

    socket.on('connect', () => {
      connected = true;
      connecting = false;
      console.log('connected');
    });

    socket.on('connect_error', (err) => {
      console.log(err.message);
    });

    socket.on('disconnect', () => {
      connected = false;
      connecting = false;
      console.log('disconnected');
    });

    socket.on('message', (arg) => {
      messages = [...messages, arg];
    });
  } else {
    console.log('not browser');
  }
</script>

<p>Welcome to the quiz game !</p>

<div>
  <h3>Connection status</h3>
  <div>Connecting: <span data-testid="connecting">{connecting.toString()}</span></div>
  <div>Connected: <span data-testid="connected">{connected.toString()}</span></div>
</div>

<div>
  <h3>Messages</h3>

  <ul data-testid="messages">
    {#each messages as message}
      <li>{message}</li>
    {/each}
  </ul>
</div>
