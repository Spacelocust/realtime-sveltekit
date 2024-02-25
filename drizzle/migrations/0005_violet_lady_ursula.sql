CREATE TABLE `lobbies` (
	`id` varchar(255) NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`password` varchar(20),
	`code` varchar(30) NOT NULL,
	`status` enum('waiting','in-progress','finished') NOT NULL DEFAULT 'waiting',
	`player_count` int NOT NULL DEFAULT 0,
	`quiz_id` varchar(255) NOT NULL,
	`created_by_id` varchar(255) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `lobbies_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `lobbies` ADD CONSTRAINT `lobbies_quiz_id_quizzes_id_fk` FOREIGN KEY (`quiz_id`) REFERENCES `quizzes`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `lobbies` ADD CONSTRAINT `lobbies_created_by_id_users_id_fk` FOREIGN KEY (`created_by_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;