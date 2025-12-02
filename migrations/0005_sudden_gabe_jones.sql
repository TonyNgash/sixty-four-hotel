PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_bookings` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`customer_id` integer,
	`room_id` integer,
	`archived_room_number` text DEFAULT '000' NOT NULL,
	`archived_room_category` text DEFAULT '000' NOT NULL,
	`archived_room_floor` text DEFAULT '000' NOT NULL,
	`check_in_date` text NOT NULL,
	`check_out_date` text NOT NULL,
	`total_amount` integer NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`payment_status` text DEFAULT 'pending' NOT NULL,
	`special_requests` text,
	`created_at` integer DEFAULT (strftime('%s','now')),
	`updated_at` integer DEFAULT (strftime('%s','now')),
	FOREIGN KEY (`customer_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`room_id`) REFERENCES `rooms`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
INSERT INTO `__new_bookings`("id", "customer_id", "room_id", "check_in_date", "check_out_date", "total_amount", "status", "payment_status", "special_requests", "created_at", "updated_at") SELECT "id", "customer_id", "room_id", "check_in_date", "check_out_date", "total_amount", "status", "payment_status", "special_requests", "created_at", "updated_at" FROM `bookings`;--> statement-breakpoint
DROP TABLE `bookings`;--> statement-breakpoint
ALTER TABLE `__new_bookings` RENAME TO `bookings`;--> statement-breakpoint
PRAGMA foreign_keys=ON;