/* eslint-disable no-console */
import { randomUUID } from 'crypto';

import { Difficulty } from '../../src/shared/enums/quizzes';
import { Role } from '../../src/shared/enums/user';
import { db } from '../db';
import { NewQuestion, questions } from '../table/questions';
import { type NewQuiz, quizzes } from '../table/quizzes';
import { type NewUser, users } from '../table/users';

const password = await Bun.password.hash('xxx');
const userValues: NewUser[] = [
  {
    id: randomUUID(),
    username: 'dallas',
    password,
    role: Role.Admin,
  },
  {
    id: randomUUID(),
    username: 'bob',
    password,
    role: Role.Admin,
  },
  {
    id: randomUUID(),
    username: 'shade',
    password,
    role: Role.Admin,
  },
  {
    id: randomUUID(),
    username: 'karl',
    password,
    role: Role.User,
  },
  {
    id: randomUUID(),
    username: 'caddyman',
    password,
    role: Role.User,
  },
];

const quizValues: Record<string, NewQuiz> = {
  geography: {
    id: randomUUID(),
    title: 'Capitals',
    description: 'Test your knowledge of world capitals.',
    category: 'Geography',
    difficulty: Difficulty.Easy,
  },
  halo: {
    id: randomUUID(),
    title: 'Halo',
    description: 'Test your knowledge of the Halo universe.',
    category: 'Gaming',
    difficulty: Difficulty.Medium,
  },
  programming: {
    id: randomUUID(),
    title: 'Programming',
    description: 'Test your knowledge of programming.',
    category: 'Technology',
    difficulty: Difficulty.Hard,
  },
};

const questionValues: NewQuestion[] = [
  {
    id: randomUUID(),
    question: 'What is the capital of France?',
    hint: 'It starts with a P.',
    choices: [
      { id: randomUUID(), label: 'Paris', isCorrect: true },
      { id: randomUUID(), label: 'London', isCorrect: false },
      { id: randomUUID(), label: 'Berlin', isCorrect: false },
      { id: randomUUID(), label: 'Madrid', isCorrect: false },
    ],
    quizId: quizValues.geography.id,
  },
  {
    id: randomUUID(),
    question: 'What is the capital of the United Kingdom?',
    hint: 'It starts with an L.',
    choices: [
      { id: randomUUID(), label: 'Paris', isCorrect: false },
      { id: randomUUID(), label: 'London', isCorrect: true },
      { id: randomUUID(), label: 'Berlin', isCorrect: false },
      { id: randomUUID(), label: 'Madrid', isCorrect: false },
    ],
    quizId: quizValues.geography.id,
  },
  {
    id: randomUUID(),
    question: 'What is the capital of Germany?',
    choices: [
      { id: randomUUID(), label: 'Paris', isCorrect: false },
      { id: randomUUID(), label: 'London', isCorrect: false },
      { id: randomUUID(), label: 'Berlin', isCorrect: true },
      { id: randomUUID(), label: 'Madrid', isCorrect: false },
    ],
    quizId: quizValues.geography.id,
  },
  {
    id: randomUUID(),
    question: 'What is the capital of Spain?',
    hint: 'It starts with an M.',
    choices: [
      { id: randomUUID(), label: 'Paris', isCorrect: false },
      { id: randomUUID(), label: 'London', isCorrect: false },
      { id: randomUUID(), label: 'Berlin', isCorrect: false },
      { id: randomUUID(), label: 'Madrid', isCorrect: true },
    ],
    quizId: quizValues.geography.id,
  },
  {
    id: randomUUID(),
    question: 'What is the capital of the United States?',
    choices: [
      { id: randomUUID(), label: 'Washington D.C.', isCorrect: true },
      { id: randomUUID(), label: 'New York', isCorrect: false },
      { id: randomUUID(), label: 'Los Angeles', isCorrect: false },
      { id: randomUUID(), label: 'Chicago', isCorrect: false },
    ],
    quizId: quizValues.geography.id,
  },
  {
    id: randomUUID(),
    question: 'How many Halo games are there?',
    hint: 'It is more than 3.',
    choices: [
      { id: randomUUID(), label: '3', isCorrect: false },
      { id: randomUUID(), label: '4', isCorrect: false },
      { id: randomUUID(), label: '5', isCorrect: true },
      { id: randomUUID(), label: '6', isCorrect: false },
    ],
    quizId: quizValues.halo.id,
  },
  {
    id: randomUUID(),
    question: 'What is the name of the main character in Halo?',
    hint: 'He is a Spartan.',
    choices: [
      { id: randomUUID(), label: 'Master Chief', isCorrect: true },
      { id: randomUUID(), label: 'Cortana', isCorrect: false },
      { id: randomUUID(), label: 'Arbiter', isCorrect: false },
      { id: randomUUID(), label: 'Spartan Locke', isCorrect: false },
    ],
    quizId: quizValues.halo.id,
  },
  {
    id: randomUUID(),
    question: 'What is the name of the AI in Halo?',
    hint: 'She is blue.',
    choices: [
      { id: randomUUID(), label: 'Master Chief', isCorrect: false },
      { id: randomUUID(), label: 'Cortana', isCorrect: true },
      { id: randomUUID(), label: 'Arbiter', isCorrect: false },
      { id: randomUUID(), label: 'Spartan Locke', isCorrect: false },
    ],
    quizId: quizValues.halo.id,
  },
  {
    id: randomUUID(),
    question: 'What is javascript?',
    choices: [
      { id: randomUUID(), label: 'A programming language', isCorrect: true },
      { id: randomUUID(), label: 'A markup language', isCorrect: false },
      { id: randomUUID(), label: 'A scripting language', isCorrect: false },
      { id: randomUUID(), label: 'A styling language', isCorrect: false },
    ],
    quizId: quizValues.programming.id,
  },
  {
    id: randomUUID(),
    question: 'What is the name of the language that styles web pages?',
    choices: [
      { id: randomUUID(), label: 'HTML', isCorrect: false },
      { id: randomUUID(), label: 'CSS', isCorrect: true },
      { id: randomUUID(), label: 'JavaScript', isCorrect: false },
      { id: randomUUID(), label: 'TypeScript', isCorrect: false },
    ],
    quizId: quizValues.programming.id,
  },
  {
    id: randomUUID(),
    question: 'What is the name of the language that adds interactivity to web pages?',
    choices: [
      { id: randomUUID(), label: 'HTML', isCorrect: false },
      { id: randomUUID(), label: 'CSS', isCorrect: false },
      { id: randomUUID(), label: 'JavaScript', isCorrect: true },
      { id: randomUUID(), label: 'TypeScript', isCorrect: false },
    ],
    quizId: quizValues.programming.id,
  },
  {
    id: randomUUID(),
    question: 'What is the name of the language that adds types to JavaScript?',
    choices: [
      { id: randomUUID(), label: 'HTML', isCorrect: false },
      { id: randomUUID(), label: 'CSS', isCorrect: false },
      { id: randomUUID(), label: 'JavaScript', isCorrect: false },
      { id: randomUUID(), label: 'TypeScript', isCorrect: true },
    ],
    quizId: quizValues.programming.id,
  },
];

await db.insert(users).values(userValues);
await db.insert(quizzes).values(Object.values(quizValues));
await db.insert(questions).values(questionValues);

console.log(`Inserted ${userValues.length} users.`);
console.log(`Inserted ${Object.values(quizValues).length} quizzes.`);
console.log(`Inserted ${questionValues.length} questions.`);

process.exit(0);
