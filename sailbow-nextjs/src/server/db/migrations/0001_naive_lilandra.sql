ALTER TABLE `crew_members` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `crew_members` MODIFY COLUMN `user_id` varchar(256);--> statement-breakpoint
ALTER TABLE `crew_members` ADD `email` varchar(256);--> statement-breakpoint
CREATE INDEX `email_idx` ON `crew_members` (`email`);