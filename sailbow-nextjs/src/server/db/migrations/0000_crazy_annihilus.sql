CREATE TABLE `boat_banners` (
	`boat_id` bigint NOT NULL,
	`show` boolean NOT NULL DEFAULT true,
	`type` varchar(256) NOT NULL,
	`value` text NOT NULL,
	`position` int NOT NULL DEFAULT 0,
	CONSTRAINT `boat_banners_boat_id` PRIMARY KEY(`boat_id`)
);
--> statement-breakpoint
CREATE TABLE `boats` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`name` varchar(50) NOT NULL,
	`description` varchar(256),
	`captain_user_id` varchar(256) NOT NULL,
	`created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `boats_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `crew_members` (
	`boat_id` bigint NOT NULL,
	`user_id` varchar(256) NOT NULL,
	`role` varchar(25) NOT NULL,
	`created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `crew_members_boat_id_user_id` PRIMARY KEY(`boat_id`,`user_id`)
);
--> statement-breakpoint
CREATE TABLE `module_comments` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`module_id` bigint NOT NULL,
	`user_id` varchar(256) NOT NULL,
	`comment` varchar(256) NOT NULL,
	CONSTRAINT `module_comments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `module_option_votes` (
	`user_id` varchar(256) NOT NULL,
	`module_option_id` bigint NOT NULL,
	CONSTRAINT `module_option_votes_module_option_id_user_id` PRIMARY KEY(`module_option_id`,`user_id`)
);
--> statement-breakpoint
CREATE TABLE `module_options` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`module_id` bigint NOT NULL,
	`data` json NOT NULL,
	CONSTRAINT `module_options_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `module_settings` (
	`module_id` bigint NOT NULL,
	`allow_multiple` boolean NOT NULL DEFAULT false,
	`anonymous_voting` boolean NOT NULL DEFAULT false,
	`deadline` timestamp,
	CONSTRAINT `module_settings_module_id` PRIMARY KEY(`module_id`)
);
--> statement-breakpoint
CREATE TABLE `modules` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`boat_id` bigint NOT NULL,
	`name` varchar(256) NOT NULL,
	`description` varchar(256),
	`order` int NOT NULL,
	`created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`type` varchar(50) NOT NULL,
	`finalized_option_id` bigint,
	`author_id` varchar(256) NOT NULL,
	CONSTRAINT `modules_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `boat_id_idx` ON `crew_members` (`boat_id`);--> statement-breakpoint
CREATE INDEX `user_id_idx` ON `crew_members` (`user_id`);--> statement-breakpoint
CREATE INDEX `module_id_idx` ON `module_comments` (`module_id`);--> statement-breakpoint
CREATE INDEX `user_id_idx` ON `module_option_votes` (`user_id`);--> statement-breakpoint
CREATE INDEX `module_option_id_idx` ON `module_option_votes` (`module_option_id`);--> statement-breakpoint
CREATE INDEX `module_id_idx` ON `module_options` (`module_id`);--> statement-breakpoint
CREATE INDEX `boat_id_idx` ON `modules` (`boat_id`);