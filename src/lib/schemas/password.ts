import { maxLength, minLength, regex, string, type Input } from 'valibot';

export const PasswordSchema = string('Please enter a password.', [
  minLength(8, 'Password must be at least 8 characters long.'),
  maxLength(100, 'Password must be at most 100 characters long.'),
  regex(/[a-z]/, 'Password must contain at least one lowercase letter.'),
  regex(/[A-Z]/, 'Password must contain at least one uppercase letter.'),
  regex(/[0-9]/, 'Password must contain at least one digit.'),
]);

export type PasswordInput = Input<typeof PasswordSchema>;
