import {
  boolean,
  excludes,
  maxLength,
  minLength,
  object,
  optional,
  string,
  type Input,
} from 'valibot';

export const LobbySchema = object({
  name: string('Please enter a name for your lobby.', [
    minLength(1, 'Please enter a name for your lobby.'),
    maxLength(255, 'Lobby name must be less than 255 characters.'),
  ]),
  description: optional(
    string('Please enter a description.', [
      maxLength(1000, 'Description must contain at most 1000 characters.'),
    ]),
  ),
  randomizeQuestions: boolean('Please select whether to randomize questions or not.'),
  private: boolean('Please select whether the lobby is private or not.'),
  useSingleAnswers: boolean('Please select whether to use single answers or not.'),
  password: optional(
    string('Please enter a password.', [
      maxLength(20, 'Password must be at most 20 characters.'),
      excludes(' ', 'Password cannot contain whitespace.'),
    ]),
  ),
  quizId: string('Please select a quiz.', [minLength(1, 'Please select a quiz.')]),
});

export const LobbyCodeSchema = object({
  code: string('Please enter a lobby code.', [minLength(1, 'Please enter a lobby code.')]),
});

export type LobbyInput = Input<typeof LobbySchema>;
export type LobbyCodeInput = Input<typeof LobbyCodeSchema>;
