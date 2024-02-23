import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { Argon2id } from 'oslo/password';
import { message, superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';

import { LoginSchema } from '$lib/schemas/login';
import { auth } from '$server/auth';
import { users } from '$server/drizzle';

import type { Actions, PageServerLoad } from './$types';

export const load = (async ({ locals }) => {
  const { session } = locals;

  if (session) {
    redirect(303, '/');
  }

  return {
    form: await superValidate(valibot(LoginSchema)),
    title: 'Login',
    seo: {
      title: 'Login',
      meta: {
        description: 'Login to your account to play the quiz game.',
      },
    },
  };
}) satisfies PageServerLoad;

export const actions: Actions = {
  login: async ({ request, locals, cookies }) => {
    const { session, db } = locals;

    if (session) {
      redirect(303, '/');
    }

    const form = await superValidate(request, valibot(LoginSchema));
    const invalidCredentialsFailure = message(form, 'Invalid credentials.', {
      status: 400,
    });

    if (!form.valid) {
      return fail(400, { form });
    }

    const { username, password } = form.data;
    const existingUser = await db.query.users.findFirst({
      where: eq(users.username, username),
    });

    if (!existingUser) {
      return invalidCredentialsFailure;
    }

    const validPassword = await new Argon2id().verify(existingUser.password, password);

    if (!validPassword) {
      return invalidCredentialsFailure;
    }

    const userSession = await auth.createSession(existingUser.id, {});
    const sessionCookie = auth.createSessionCookie(userSession.id);

    cookies.set(sessionCookie.name, sessionCookie.value, {
      path: '.',
      ...sessionCookie.attributes,
    });

    redirect(303, '/');
  },
};
