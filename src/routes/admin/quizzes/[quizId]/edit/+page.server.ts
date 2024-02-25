import { fail } from '@sveltejs/kit';
import { eq, inArray, sql } from 'drizzle-orm';
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
    const newOrUpdatedQuestions: typeof questions = [];
    const deletedQuestions: string[] = [];

    questions.forEach((question) => {
      if (
        currentQuestions.some((currentQuestion) => currentQuestion.id === question.id) ||
        !question.id
      ) {
        newOrUpdatedQuestions.push(question);
      } else {
        deletedQuestions.push(question.id);
      }
    });

    await db.transaction(async ({ insert, update, delete: dbDelete }) => {
      // Update the quiz
      await update(quizzesTable)
        .set(quiz)
        .where(eq(quizzesTable.id, sql.placeholder('quizId')))
        .prepare()
        .execute({ quizId: params.quizId });

      // Insert or update questions
      await insert(questionsTable).values(
        newOrUpdatedQuestions.map(({ choices, ...question }) => ({
          id: question.id ?? randomUUID(),
          quizId: params.quizId,
          choices: choices.map(({ id, ...choice }) => ({ id: id ?? randomUUID(), ...choice })),
          ...question,
        })),
      );

      // Delete questions that were removed
      await dbDelete(questionsTable).where(inArray(questionsTable.id, deletedQuestions));
    });

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
