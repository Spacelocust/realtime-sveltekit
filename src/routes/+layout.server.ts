import { loadFlash } from 'sveltekit-flash-message/server';

import type { LayoutServerLoad } from './$types';

export const load = loadFlash(({ locals }) => {
  return {
    title: 'The Quiz Game',
    seo: {
      title: 'The Quiz Game',
      meta: {
        description: 'Real-time quiz game with your friends.',
      },
    },
    user: locals.user,
  };
}) satisfies LayoutServerLoad;
