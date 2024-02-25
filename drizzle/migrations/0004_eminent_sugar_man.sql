ALTER TABLE `questions` DROP FOREIGN KEY `questions_quiz_id_quizzes_id_fk`;
--> statement-breakpoint
ALTER TABLE `questions` ADD CONSTRAINT `questions_quiz_id_quizzes_id_fk` FOREIGN KEY (`quiz_id`) REFERENCES `quizzes`(`id`) ON DELETE cascade ON UPDATE no action;