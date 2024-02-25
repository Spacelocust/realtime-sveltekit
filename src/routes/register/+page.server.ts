import { fail } from '@sveltejs/kit';
import { eq, sql } from 'drizzle-orm';
import { Argon2id } from 'oslo/password';
import { redirect } from 'sveltekit-flash-message/server';
import { setError, superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';

import { randomUUID } from 'node:crypto';

import { Role } from '$lib/enums/user';
import { RegisterSchema } from '$lib/schemas/register';
import { auth } from '$server/auth';
import { users } from '$server/drizzle';

import type { Actions, PageServerLoad } from './$types';

export const load = (async ({ locals }) => {
  const { session } = locals;

  if (session) {
    redirect(303, '/');
  }

  return {
    form: await superValidate(valibot(RegisterSchema)),
    title: 'Register',
    seo: {
      title: 'Register',
      meta: {
        description: 'Create an account to play the quiz game.',
      },
    },
  };
}) satisfies PageServerLoad;

export const actions: Actions = {
  register: async (event) => {
    const { request, locals, cookies } = event;
    const { session, db } = locals;

    if (session) {
      redirect(303, '/');
    }

    const form = await superValidate(request, valibot(RegisterSchema));

    if (!form.valid) {
      return fail(400, { form });
    }

    const existingUser = await db.query.users
      .findFirst({ where: eq(users.username, sql.placeholder('username')) })
      .prepare()
      .execute({ username: form.data.username.trim() });

    if (existingUser) {
      return setError(form, 'username', 'This username is already taken.');
    }

    const id = randomUUID();
    const hashedPassword = await new Argon2id().hash(form.data.password);

    await db.insert(users).values({
      id,
      username: form.data.username.trim(),
      password: hashedPassword,
      role: Role.User,
    });

    const userSession = await auth.createSession(id, {});
    const sessionCookie = auth.createSessionCookie(userSession.id);

    cookies.set(sessionCookie.name, sessionCookie.value, {
      path: '.',
      ...sessionCookie.attributes,
    });

    redirect(
      302,
      '/',
      { message: 'Account created ! You are now logged in.', type: 'success' },
      event,
    );
  },
};
