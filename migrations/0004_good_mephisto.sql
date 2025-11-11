CREATE TABLE `view_types` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`created_at` integer DEFAULT (strftime('%s','now'))
);
--> statement-breakpoint
CREATE UNIQUE INDEX `view_types_name_unique` ON `view_types` (`name`);