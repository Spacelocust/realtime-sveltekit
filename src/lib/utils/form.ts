import { toast } from 'svelte-sonner';

import type { FormOptions } from 'sveltekit-superforms';

export const defaultFormOptions: FormOptions = {
  onError() {
    toast.error('Oops! Something went wrong. Please try again.');
  },
  onUpdated({ form: updatedForm }) {
    if (!updatedForm.valid) {
      if (typeof updatedForm.message === 'string') {
        toast.error(updatedForm.message);
      } else {
        toast.error('The form is invalid. Please check the fields and try again.');
      }
    }
  },
  delayMs: 300,
  timeoutMs: 8000,
};
