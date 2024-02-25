import { fail } from '@sveltejs/kit';
import { and, eq, inArray, sql } from 'drizzle-orm';
import { redirect } from 'sveltekit-flash-message/server';
import { message, superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';

import { randomUUID } from 'crypto';

import { QuizSchema } from '$lib/schemas/quiz';
import { quizzes as quizzesTable, questions as questionsTable } from '$server/drizzle';

import type { Actions, PageServerLoad } from './$types';

export const load = (async ({ parent }) => {
  const { quiz } = await parent();

  return {
    quiz,
    form: await superValidate(
      {
        title: quiz.title,
        description: quiz.description ?? undefined,
        category: quiz.category ?? undefined,
        difficulty: quiz.difficulty,
        questions: quiz.questions.map(({ id, question, hint, choices }) => ({
          id,
          question,
          hint: hint ?? undefined,
          choices,
        })),
      },
      valibot(QuizSchema),
      {},
    ),
    title: 'Edit Quiz',
    seo: {
      title: 'Edit Quiz',
      meta: {
        description: `Edit the quiz "${quiz.title}" and its questions.`,
      },
    },
  };
}) satisfies PageServerLoad;

export const actions: Actions = {
  edit: async (event) => {
    const { request, locals, params } = event;
    const { db } = locals;

    const form = await superValidate(request, valibot(QuizSchema));

    if (!form.valid) {
      return fail(400, { form });
    }

    const currentQuestions = await db.query.questions
      .findMany({
        where: (currentQuestionsTable) =>
          eq(currentQuestionsTable.quizId, sql.placeholder('quizId')),
      })
      .prepare()
      .execute({ quizId: params.quizId });
    const { questions, ...quiz } = form.data;
    const newQuestions: typeof questions = [];
    const updatedQuestions: ((typeof questions)[number] & { id: string })[] = [];
    const deletedQuestions: string[] = [];

    questions.forEach((question) => {
      if (!question.id) {
        newQuestions.push(question);
      } else if (currentQuestions.some((currentQuestion) => currentQuestion.id === question.id)) {
        updatedQuestions.push(question as (typeof updatedQuestions)[number]);
      } else {
        deletedQuestions.push(question.id);
      }
    });

    const promises = [
      // Update the quiz
      db
        .update(quizzesTable)
        .set(quiz)
        .where(eq(quizzesTable.id, sql.placeholder('quizId')))
        .prepare()
        .execute({ quizId: params.quizId }),
    ];

    // Insert new questions
    if (newQuestions.length > 0) {
      promises.push(
        db.insert(questionsTable).values(
          newQuestions.map(({ choices, ...question }) => ({
            id: question.id ?? randomUUID(),
            quizId: params.quizId,
            choices: choices.map(({ id, ...choice }) => ({ id: id ?? randomUUID(), ...choice })),
            ...question,
          })),
        ),
      );
    }

    // Update existing questions
    if (updatedQuestions.length > 0) {
      promises.push(
        ...updatedQuestions.map(({ choices, ...question }) =>
          db
            .update(questionsTable)
            .set({
              quizId: params.quizId,
              choices: choices.map(({ id, ...choice }) => ({ id: id ?? randomUUID(), ...choice })),
              ...question,
            })
            .where(
              and(eq(questionsTable.id, question.id), eq(questionsTable.quizId, params.quizId)),
            ),
        ),
      );
    }

    // Delete questions that were removed
    if (deletedQuestions.length > 0) {
      promises.push(db.delete(questionsTable).where(inArray(questionsTable.id, deletedQuestions)));
    }

    await Promise.all(promises);

    return message(form, 'Quiz updated successfully.');
  },
  delete: async (event) => {
    const { locals, params } = event;
    const { db } = locals;

    await db.delete(quizzesTable).where(eq(quizzesTable.id, params.quizId));

    redirect(
      302,
      '/admin/quizzes',
      { message: 'Quiz deleted successfully.', type: 'success' },
      event,
    );
  },
};
