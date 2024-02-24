import {
  array,
  boolean,
  every,
  maxLength,
  minLength,
  object,
  optional,
  some,
  string,
  type Input,
} from 'valibot';

export const ChoiceSchema = object({
  label: string('Please enter a label.', [
    minLength(1, 'Label must contain at least 1 character.'),
    maxLength(100, 'Label must contain at most 255 characters.'),
  ]),
  isCorrect: boolean('Please select whether this choice is correct.'),
});

export const QuestionSchema = object({
  question: string('Please enter a question.', [
    minLength(10, 'Question must contain at least 10 characters.'),
    maxLength(255, 'Question must contain at most 255 characters.'),
  ]),
  hint: optional(
    string('Please enter a hint.', [maxLength(1000, 'Hint must contain at most 1000 characters.')]),
  ),
  choices: array(ChoiceSchema, [
    minLength(2, 'Question must contain at least 2 choices.'),
    maxLength(5, 'Question must contain at most 5 choices.'),
    some((value) => value.isCorrect, 'Question must contain at least 1 correct choice.'),
    every(
      (value, index, choices) => !choices.some((otherChoice) => otherChoice.label === value.label),
      'Choices must be unique.',
    ),
  ]),
});

export type ChoiceInput = Input<typeof ChoiceSchema>;
export type QuestionInput = Input<typeof QuestionSchema>;
