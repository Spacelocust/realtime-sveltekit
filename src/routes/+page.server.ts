import { fail, redirect } from '@sveltejs/kit';

import { auth } from '$server/auth';

import type { Actions, PageServerLoad } from './$types';

export const load = (async () => {
  return {};
}) satisfies PageServerLoad;

export const actions: Actions = {
  logout: async ({ locals, cookies }) => {
    const { session } = locals;

    if (!session) {
      return fail(401);
    }

    await auth.invalidateSession(session.id);
    const sessionCookie = auth.createBlankSessionCookie();

    cookies.set(sessionCookie.name, sessionCookie.value, {
      path: '.',
      ...sessionCookie.attributes,
    });

    redirect(302, '/login');
  },
};
