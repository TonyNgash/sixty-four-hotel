CREATE TABLE `amenities` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`icon_url` text,
	`created_at` integer DEFAULT (strftime('%s','now'))
);
--> statement-breakpoint
CREATE TABLE `bookings` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`customer_id` integer,
	`room_id` integer,
	`check_in_date` integer NOT NULL,
	`check_out_date` integer NOT NULL,
	`total_amount` integer NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`payment_status` text DEFAULT 'pending' NOT NULL,
	`special_requests` text,
	`created_at` integer DEFAULT (strftime('%s','now')),
	`updated_at` integer DEFAULT (strftime('%s','now')),
	FOREIGN KEY (`customer_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`room_id`) REFERENCES `rooms`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `cancellation_policies` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`days_before_checkin` integer NOT NULL,
	`refund_percentage` integer NOT NULL,
	`is_active` integer DEFAULT true,
	`created_at` integer DEFAULT (strftime('%s','now'))
);
--> statement-breakpoint
CREATE TABLE `phone_verifications` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer,
	`code` text NOT NULL,
	`expires_at` integer NOT NULL,
	`attempts` integer DEFAULT 0,
	`created_at` integer DEFAULT (strftime('%s','now')),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `pricing_rules` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`room_category_id` integer,
	`start_date` integer NOT NULL,
	`end_date` integer NOT NULL,
	`price_modifier` real NOT NULL,
	`description` text NOT NULL,
	`created_at` integer DEFAULT (strftime('%s','now')),
	FOREIGN KEY (`room_category_id`) REFERENCES `room_categories`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `room_amenities` (
	`room_id` integer,
	`amenity_id` integer,
	`created_at` integer DEFAULT (strftime('%s','now')),
	FOREIGN KEY (`room_id`) REFERENCES `rooms`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`amenity_id`) REFERENCES `amenities`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `room_categories` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`base_price` integer NOT NULL,
	`max_occupancy` integer NOT NULL,
	`featured_image_url` text,
	`created_at` integer DEFAULT (strftime('%s','now'))
);
--> statement-breakpoint
CREATE TABLE `room_images` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`room_id` integer,
	`image_url` text NOT NULL,
	`alt_text` text,
	`sort_order` integer DEFAULT 0,
	`is_primary` integer DEFAULT false,
	`created_at` integer DEFAULT (strftime('%s','now')),
	FOREIGN KEY (`room_id`) REFERENCES `rooms`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `rooms` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`room_number` text NOT NULL,
	`category_id` integer,
	`status` text DEFAULT 'available' NOT NULL,
	`floor` integer NOT NULL,
	`view_type` text,
	`created_at` integer DEFAULT (strftime('%s','now')),
	FOREIGN KEY (`category_id`) REFERENCES `room_categories`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `rooms_room_number_unique` ON `rooms` (`room_number`);