ALTER TABLE `questions` ADD `created_at` timestamp DEFAULT (now()) NOT NULL;--> statement-breakpoint
ALTER TABLE `quizzes` ADD `created_at` timestamp DEFAULT (now()) NOT NULL;