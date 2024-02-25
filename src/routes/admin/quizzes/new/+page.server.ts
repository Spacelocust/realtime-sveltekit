import { fail } from '@sveltejs/kit';
import { redirect } from 'sveltekit-flash-message/server';
import { superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';

import { randomUUID } from 'crypto';

import { QuizSchema } from '$lib/schemas/quiz';
import { quizzes as quizzesTable, questions as questionsTable } from '$server/drizzle';

import type { Actions, PageServerLoad } from './$types';

export const load = (async () => {
  return {
    form: await superValidate(valibot(QuizSchema)),
    title: 'Create a new quiz',
    seo: {
      title: 'Create a new quiz',
      meta: {
        description: 'Create a new quiz to be used in games.',
      },
    },
  };
}) satisfies PageServerLoad;

export const actions: Actions = {
  new: async (event) => {
    const { request, locals } = event;
    const { db } = locals;

    const form = await superValidate(request, valibot(QuizSchema));

    if (!form.valid) {
      return fail(400, { form });
    }

    const { questions, ...quiz } = form.data;
    const quizId = randomUUID();

    await db.insert(quizzesTable).values({ id: quizId, ...quiz });
    await db.insert(questionsTable).values(
      questions.map(({ choices, ...question }) => ({
        id: randomUUID(),
        quizId,
        choices: choices.map((choice) => ({ id: randomUUID(), ...choice })),
        ...question,
      })),
    );

    redirect(
      302,
      `/admin/quizzes/${quizId}/edit`,
      { message: 'Quiz created successfully.', type: 'success' },
      event,
    );
  },
};
