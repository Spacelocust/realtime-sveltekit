<script lang="ts">
  import * as Card from '$lib/components/ui/card';
  import * as Table from '$lib/components/ui/table';

  import type { Player } from '$socket/types';

  import { PUBLIC_MAX_PLAYERS } from '$env/static/public';

  export let players: Player[] = [];
</script>

<Card.Root class="">
  <Card.Header>
    <Card.Title>Players <span>({players.length}/{PUBLIC_MAX_PLAYERS})</span></Card.Title>
  </Card.Header>
  <Card.Content>
    <Table.Root>
      <Table.Caption>List of currently connected players with their scores.</Table.Caption>
      <Table.Header>
        <Table.Row>
          <Table.Head>Name</Table.Head>
          <Table.Head>Score</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {#each players as player (player.name)}
          <Table.Row>
            <Table.Cell class="font-medium">{player.name}</Table.Cell>
            <Table.Cell>{player.score}</Table.Cell>
          </Table.Row>
        {/each}
      </Table.Body>
    </Table.Root>
  </Card.Content>
</Card.Root>
