import { error } from '@sveltejs/kit';
import { and } from 'drizzle-orm';
import { redirect } from 'sveltekit-flash-message/server';

import { GameStatus } from '$shared/enums/lobby';

import type { PageServerLoad } from './$types';

export const load = (async ({ locals, params }) => {
  const { db, session, user } = locals;

  if (!session || !user) {
    redirect(303, '/login');
  }

  const gameLobby = await db.query.lobbies
    .findFirst({
      where: (lobbies, { eq, not, sql }) =>
        and(
          eq(lobbies.id, sql.placeholder('gameId')),
          not(eq(lobbies.status, sql.placeholder('finishedStatus'))),
        ),
    })
    .prepare()
    .execute({ gameId: params.gameId, finishedStatus: GameStatus.Finished });

  if (!gameLobby) {
    error(404, 'Game not found.');
  }

  const { password, ...gameLobbyWithoutPassword } = gameLobby;

  return {
    gameLobby: gameLobbyWithoutPassword,
    hasPassword: !!password,
    isHost: gameLobby.createdById === user.id,
    title: gameLobby.name,
    seo: {
      title: gameLobby.name,
      meta: {
        description: gameLobby.description ?? `Game lobby for ${gameLobby.name}.`,
        robots: 'noindex, nofollow',
      },
    },
  };
}) satisfies PageServerLoad;
