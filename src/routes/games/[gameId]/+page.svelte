<script lang="ts">
  import { io } from 'socket.io-client';
  import { onDestroy, onMount } from 'svelte';

  import type { PageData } from './$types';
  import type { Socket } from '$types/socket';

  import { PUBLIC_HOST } from '$env/static/public';

  export let data: PageData;

  let socket: Socket;

  onMount(() => {
    socket = io(PUBLIC_HOST);

    socket.on('connect', () => {
      console.log('connected');
    });

    socket.on('connect_error', (err) => {
      console.log(err.message);
    });

    socket.on('disconnect', () => {
      console.log('disconnected');
    });

    socket.on('message', (arg) => {
      console.log('message', arg);
    });
  });

  onDestroy(() => {
    if (socket) {
      socket.disconnect();
    }
  });
</script>

<h2>{data.gameLobby.name}</h2>
