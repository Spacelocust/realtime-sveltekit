import { object, type Input } from 'valibot';

export const QuizzSchema = object({});

export type QuizzInput = Input<typeof QuizzSchema>;
