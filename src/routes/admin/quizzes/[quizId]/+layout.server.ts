import { error } from '@sveltejs/kit';

import type { LayoutServerLoad } from './$types';

export const load = (async ({ locals, params }) => {
  const { quizId } = params;
  const quiz = await locals.db.query.quizzes
    .findFirst({
      where: (quizzes, { eq, sql }) => eq(quizzes.id, sql.placeholder('quizId')),
      with: {
        questions: true,
      },
    })
    .prepare()
    .execute({ quizId });

  if (!quiz) {
    error(404, {
      message: 'Quiz not found.',
    });
  }

  return {
    quiz,
  };
}) satisfies LayoutServerLoad;
