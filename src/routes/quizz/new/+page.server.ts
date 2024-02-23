import { redirect } from 'sveltekit-flash-message/server';
import { superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';

import { QuizzSchema } from '$lib/schemas/quizz';

import type { PageServerLoad } from './$types';

export const load = (async ({ locals }) => {
  const { session } = locals;

  if (session) {
    redirect(303, '/');
  }

  return {
    form: await superValidate(valibot(QuizzSchema)),
  };
}) satisfies PageServerLoad;
