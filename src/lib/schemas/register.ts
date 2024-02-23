import {
  custom,
  excludes,
  forward,
  maxLength,
  minLength,
  object,
  string,
  type Input,
} from 'valibot';

import { PasswordSchema } from './password';

export const RegisterSchema = object(
  {
    username: string('Please enter a username.', [
      minLength(2, 'Username must be at least 2 characters long.'),
      maxLength(30, 'Username must be at most 30 characters long.'),
      excludes(' ', 'Username cannot contain whitespace.'),
    ]),
    password: PasswordSchema,
    repeatPassword: string('Please repeat your password.', [
      minLength(1, 'Please repeat your password.'),
    ]),
  },
  [
    forward(
      custom(
        ({ password, repeatPassword }) => password === repeatPassword,
        'Passwords do not match.',
      ),
      ['repeatPassword'],
    ),
  ],
);

export type RegisterInput = Input<typeof RegisterSchema>;
