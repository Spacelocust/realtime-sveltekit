import { fail } from '@sveltejs/kit';
import { desc } from 'drizzle-orm';
import { generateId } from 'lucia';
import { redirect } from 'sveltekit-flash-message/server';
import { setError, superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import { safeParse } from 'valibot';

import { randomUUID } from 'crypto';

import { LobbyCodeSchema, LobbySchema } from '$lib/schemas/lobby';
import {
  LobbyFilterNameSchema,
  LobbyFilterQuizIdSchema,
  LobbyFilterStatusSchema,
} from '$lib/schemas/lobby-filter';
import { lobbies as lobbiesTable, quizzes as quizzesTable } from '$server/drizzle';
import { GameStatus } from '$shared/enums/lobby';

import type { Actions, PageServerLoad } from './$types';

import { PUBLIC_MAX_PLAYERS } from '$env/static/public';

export const load = (async ({ locals, url }) => {
  const { db, session } = locals;

  if (!session) {
    redirect(303, '/login');
  }

  const nameFilter = safeParse(LobbyFilterNameSchema, url.searchParams.get('name'));
  const statusFilter = safeParse(LobbyFilterStatusSchema, url.searchParams.get('status'));
  const quizIdFilter = safeParse(LobbyFilterQuizIdSchema, url.searchParams.get('quizId'));
  const [gameLobbies, quizzes] = await Promise.all([
    db.query.lobbies
      .findMany({
        columns: {
          password: false,
        },
        where: (lobbies, { eq, not, and, lt, like, sql }) =>
          and(
            not(eq(lobbies.private, true)),
            lt(lobbies.playerCount, sql.placeholder('maxPlayers')),
            nameFilter.success && nameFilter.output
              ? like(lobbies.name, sql.placeholder('name'))
              : undefined,
            statusFilter.success && statusFilter.output
              ? eq(lobbies.status, sql.placeholder('status'))
              : not(eq(lobbies.status, sql.placeholder('finishedStatus'))),
            quizIdFilter.success && quizIdFilter.output
              ? eq(lobbies.quizId, sql.placeholder('quizId'))
              : undefined,
          ),
        with: {
          quiz: true,
        },
      })
      .prepare()
      .execute({
        maxPlayers: parseInt(PUBLIC_MAX_PLAYERS, 10),
        finishedStatus:
          statusFilter.success && statusFilter.output ? undefined : GameStatus.Finished,
        name: nameFilter.success ? `%${nameFilter.output}%` : undefined,
        status: statusFilter.success ? statusFilter.output : undefined,
        quizId: quizIdFilter.success ? quizIdFilter.output : undefined,
      }),
    db.select().from(quizzesTable).orderBy(desc(quizzesTable.title)),
  ]);

  return {
    lobbies: gameLobbies,
    quizzes,
    lobbyForm: await superValidate(valibot(LobbySchema)),
    lobbyCodeForm: await superValidate(valibot(LobbyCodeSchema)),
    nameFilter: nameFilter.success ? nameFilter.output : '',
    statusFilter: statusFilter.success ? statusFilter.output : '',
    quizIdFilter: quizIdFilter.success ? quizIdFilter.output : '',
    title: 'Game Lobbies',
    seo: {
      title: 'Game Lobbies',
      meta: {
        description: 'Join or create a game lobby to play with your friends or other players.',
      },
    },
  };
}) satisfies PageServerLoad;

export const actions: Actions = {
  new: async (event) => {
    const { request, locals } = event;
    const { db, session } = locals;

    if (!session) {
      redirect(303, '/login');
    }

    const form = await superValidate(request, valibot(LobbySchema));

    if (!form.valid) {
      return fail(400, { form });
    }

    const gameId = randomUUID();
    const code = generateId(20);

    await db.insert(lobbiesTable).values({
      id: gameId,
      code,
      createdById: session.userId,
      ...form.data,
    });

    redirect(
      302,
      `/games/${gameId}`,
      {
        message: `Lobby created! Share the code "${code}" with your friends to join.`,
        type: 'success',
      },
      event,
    );
  },
  joinByCode: async (event) => {
    const { request, locals } = event;
    const { db, session } = locals;

    if (!session) {
      redirect(303, '/login');
    }

    const form = await superValidate(request, valibot(LobbyCodeSchema));

    if (!form.valid) {
      return fail(400, { form });
    }

    const lobby = await db.query.lobbies
      .findFirst({
        where: (lobbies, { eq, sql }) => eq(lobbies.code, sql.placeholder('code')),
      })
      .prepare()
      .execute({ code: form.data.code });

    if (!lobby) {
      return setError(form, 'code', 'This lobby code does not exist.');
    }

    redirect(302, `/games/${lobby.id}`);
  },
};
