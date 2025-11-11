CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`email` text NOT NULL,
	`password_hash` text,
	`role` text NOT NULL,
	`first_name` text,
	`last_name` text,
	`phone` text NOT NULL,
	`email_verified_at` integer,
	`phone_verified_at` integer,
	`verification_token` text,
	`reset_token` text,
	`reset_token_expires` integer,
	`account_status` text NOT NULL,
	`created_at` integer DEFAULT (strftime('%s','now')),
	`updated_at` integer DEFAULT (strftime('%s','now'))
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);