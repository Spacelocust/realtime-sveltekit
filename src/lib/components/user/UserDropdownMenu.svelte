<script lang="ts">
  import { User } from 'lucide-svelte';

  import Button from '$components/ui/button/button.svelte';
  import * as DropdownMenu from '$components/ui/dropdown-menu';
  import { Role } from '$shared/enums/user';

  import type { User as UserType } from 'lucia';

  import { enhance } from '$app/forms';

  export let user: UserType | null;
</script>

<DropdownMenu.Root {...$$restProps}>
  <DropdownMenu.Trigger asChild let:builder>
    <Button builders={[builder]} size="icon">
      <span class="sr-only">Open account menu</span>
      <User />
    </Button>
  </DropdownMenu.Trigger>
  <DropdownMenu.Content>
    <DropdownMenu.Label>My Account</DropdownMenu.Label>
    <DropdownMenu.Separator />
    <DropdownMenu.Group>
      {#if user}
        <DropdownMenu.Label>Logged in as {user.username}</DropdownMenu.Label>
        <DropdownMenu.Separator />
        {#if user.role === Role.Admin}
          <DropdownMenu.Label>Admin</DropdownMenu.Label>
          <DropdownMenu.Group>
            <DropdownMenu.Item>
              <a href="/admin/quizzes" class="w-full">Quizzes</a>
            </DropdownMenu.Item>
            <DropdownMenu.Separator />
          </DropdownMenu.Group>
        {/if}
        <DropdownMenu.Item>
          <form method="post" action="/?/logout" use:enhance>
            <button type="submit">Logout</button>
          </form>
        </DropdownMenu.Item>
      {:else}
        <DropdownMenu.Item>
          <a href="/login" class="w-full">Login</a>
        </DropdownMenu.Item>
        <DropdownMenu.Item>
          <a href="/register" class="w-full">Register</a>
        </DropdownMenu.Item>
      {/if}
    </DropdownMenu.Group>
  </DropdownMenu.Content>
</DropdownMenu.Root>
