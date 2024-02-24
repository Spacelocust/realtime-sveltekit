CREATE TABLE `questions` (
	`id` varchar(255) NOT NULL,
	`question` varchar(255) NOT NULL,
	`hint` text,
	`choices` json NOT NULL DEFAULT ('[]'),
	`quiz_id` varchar(255) NOT NULL,
	CONSTRAINT `questions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `quizzes` (
	`id` varchar(255) NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`category` varchar(255),
	`difficulty` enum('easy','medium','hard','overkill') NOT NULL,
	CONSTRAINT `quizzes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `questions` ADD CONSTRAINT `questions_quiz_id_quizzes_id_fk` FOREIGN KEY (`quiz_id`) REFERENCES `quizzes`(`id`) ON DELETE no action ON UPDATE no action;