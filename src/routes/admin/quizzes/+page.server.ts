import { desc, eq, getTableColumns, sql } from 'drizzle-orm';

import { questions, quizzes as quizzesTable } from '$server/drizzle';

import type { PageServerLoad } from './$types';

export const load = (async ({ locals }) => {
  const { db } = locals;
  const quizzes = await db
    .select({
      ...getTableColumns(quizzesTable),
      questionsCount: sql<number>`cast(count(${questions.quizId}) as int)`,
    })
    .from(quizzesTable)
    .leftJoin(questions, eq(quizzesTable.id, questions.quizId))
    .groupBy(quizzesTable.id)
    .orderBy(desc(quizzesTable.createdAt));

  return {
    quizzes,
    title: 'Quizzes',
    seo: {
      title: 'Quizzes',
      meta: {
        description: 'All the quizzes created and available in games.',
      },
    },
  };
}) satisfies PageServerLoad;
