import {
  array,
  every,
  maxLength,
  merge,
  minLength,
  object,
  optional,
  picklist,
  string,
  type Input,
} from 'valibot';

import { Difficulty } from '$lib/enums/quizzes';

import { QuestionSchema } from './question';

export const difficultyOptions = [
  { value: Difficulty.Easy, label: 'Easy' },
  { value: Difficulty.Medium, label: 'Medium' },
  { value: Difficulty.Hard, label: 'Hard' },
  { value: Difficulty.Overkill, label: 'Overkill' },
] as const;

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
  difficulty: picklist(
    [Difficulty.Easy, Difficulty.Medium, Difficulty.Hard, Difficulty.Overkill],
    'Please select a difficulty.',
  ),
  questions: array(merge([QuestionSchema, object({ id: optional(string()) })]), [
    minLength(1, 'Quiz must contain at least 5 questions.'),
    maxLength(20, 'Quiz must contain at most 20 questions.'),
    every(
      (value, index, otherQuestions) =>
        !otherQuestions.some(
          (otherQuestion, otherIndex) =>
            otherIndex !== index && otherQuestion.question === value.question,
        ),
      'Questions must be unique.',
    ),
  ]),
});

export type QuizInput = Input<typeof QuizSchema>;
