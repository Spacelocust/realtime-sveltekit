import { redirect } from '@sveltejs/kit';

import type { PageServerLoad } from './$types';

export const load = (async ({ locals }) => {
  const { session } = locals;

  if (!session) {
    redirect(303, '/');
  }

  return {};
}) satisfies PageServerLoad;
