import { redirect } from '@sveltejs/kit';

import { db } from '$drizzle/db';

import type { PageServerLoad } from './$types';

export const load = (async ({ locals }) => {
  const { session } = locals;

  if (!session) {
    redirect(303, '/');
  }

  const quizzes = await db.query.quizzes.findMany();

  return {
    quizzes,
  };
}) satisfies PageServerLoad;
