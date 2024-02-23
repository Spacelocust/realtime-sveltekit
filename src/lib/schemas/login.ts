import { minLength, object, string, type Input } from 'valibot';

export const LoginSchema = object({
  username: string('Please enter your username.', [minLength(1, 'Please enter your username.')]),
  password: string('Please enter your password.', [minLength(1, 'Please enter your password.')]),
});

export type LoginInput = Input<typeof LoginSchema>;
