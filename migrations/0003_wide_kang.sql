CREATE TABLE `audit_logs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer,
	`action` text NOT NULL,
	`resource` text,
	`resource_id` integer,
	`ip_address` text,
	`user_agent` text,
	`details` text,
	`created_at` integer DEFAULT (strftime('%s','now')),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `login_attempts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer,
	`email` text NOT NULL,
	`ip_address` text NOT NULL,
	`user_agent` text,
	`attempt_type` text NOT NULL,
	`successful` integer NOT NULL,
	`failure_reason` text,
	`attempted_at` integer DEFAULT (strftime('%s','now')),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
ALTER TABLE `users` ADD `failed_attempts` integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE `users` ADD `locked_until` integer;--> statement-breakpoint
ALTER TABLE `users` ADD `last_login_attempt` integer;