import { array, enum_, maxLength, minLength, object, optional, string, type Input } from 'valibot';

import { Difficulty } from '$server/drizzle';

import { QuestionSchema } from './question';

export const QuizSchema = object({
  title: string('Please enter a title.', [
    minLength(1, 'Title must contain at least 1 character.'),
    maxLength(255, 'Title must contain at most 255 characters.'),
  ]),
  description: optional(
    string('Please enter a description.', [
      maxLength(1000, 'Description must contain at most 1000 characters.'),
    ]),
  ),
  category: optional(
    string('Please enter a category.', [
      maxLength(255, 'Category must contain at most 255 characters.'),
    ]),
  ),
  difficulty: enum_(Difficulty, 'Please select a difficulty.'),
  questions: array(QuestionSchema, [
    minLength(5, 'Quiz must contain at least 5 questions.'),
    maxLength(20, 'Quiz must contain at most 20 questions.'),
  ]),
});

export type QuizInput = Input<typeof QuizSchema>;
