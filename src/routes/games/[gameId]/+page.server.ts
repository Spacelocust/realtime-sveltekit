import { error } from '@sveltejs/kit';
import { redirect } from 'sveltekit-flash-message/server';

import type { PageServerLoad } from './$types';

export const load = (async ({ locals, params }) => {
  const { db, session } = locals;

  if (!session) {
    redirect(303, '/login');
  }

  const gameLobby = await db.query.lobbies
    .findFirst({
      where: (lobbies, { eq, sql }) => eq(lobbies.id, sql.placeholder('gameId')),
    })
    .prepare()
    .execute({ gameId: params.gameId });

  if (!gameLobby) {
    error(404, 'Game not found.');
  }

  return {
    gameLobby,
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
