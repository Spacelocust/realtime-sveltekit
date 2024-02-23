<script lang="ts">
  import { browser } from '$app/environment';
  import { io } from 'socket.io-client';

  let ws: WebSocket | null = null;

  let connecting = true;
  let connected = false;

  let messages: string[] = [];

  if (browser) {
    console.log('in browser');

    ws = new WebSocket(`ws://${location.host}/ws`);

    ws.addEventListener('open', (ev) => {
      connected = true;
      connecting = false;

      console.log('connected');
    });

    ws.addEventListener('close', () => {
      connected = false;
      connecting = false;
    });

    ws.addEventListener('message', (ev) => {
      const msg = ev.data;

      messages = [...messages, msg];
    });
  } else {
    // console.log('not browser');
  }
</script>

<p>Welcome to the quiz game !</p>

<h1>Demo page</h1>

<div>
  <h3>Connection status</h3>
  <div>Connecting: <span data-testid="connecting">{connecting.toString()}</span></div>
  <div>Connected: <span data-testid="connected">{connected.toString()}</span></div>
</div>

<div>
  <h3>Messages</h3>

  <ul data-testid="messages">
    {#each messages as message, index}
      <li>{message}</li>
    {/each}
  </ul>
</div>
