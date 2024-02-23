import type { Auth as AuthType } from '$lib/server/auth';
import type { db } from '$server/drizzle';
import type { Session, User } from 'lucia';
import type { SchemaIssues } from 'valibot';

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
  namespace App {
    interface Error {
      message: string;
      errors?: SchemaIssues;
    }
    interface Locals {
      user: User | null;
      session: Session | null;
      db: typeof db;
    }
    interface PageData {
      title?: string;
      flash?: { type: 'success' | 'error' | 'info' | 'warning'; message: string };
      seo?: {
        title?: string;
        meta?: {
          description?: string;
          [key: string]: string;
        };
      };
    }
    // interface Platform {}
  }

  interface ViewTransition {
    updateCallbackDone: Promise<void>;
    ready: Promise<void>;
    finished: Promise<void>;
    skipTransition: () => void;
  }

  interface Document {
    startViewTransition(updateCallback: () => Promise<void>): ViewTransition;
  }
}

declare module 'lucia' {
  interface Register {
    Lucia: AuthType;
    DatabaseUserAttributes: {
      username: string;
    };
  }
}
