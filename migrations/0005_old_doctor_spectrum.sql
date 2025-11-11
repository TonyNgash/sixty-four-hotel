PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_rooms` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`room_number` text NOT NULL,
	`category_id` integer,
	`status` text DEFAULT 'available' NOT NULL,
	`floor` integer NOT NULL,
	`view_type_id` integer,
	`created_at` integer DEFAULT (strftime('%s','now')),
	FOREIGN KEY (`category_id`) REFERENCES `room_categories`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`view_type_id`) REFERENCES `view_types`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_rooms`("id", "room_number", "category_id", "status", "floor", "view_type_id", "created_at") SELECT "id", "room_number", "category_id", "status", "floor", "view_type_id", "created_at" FROM `rooms`;--> statement-breakpoint
DROP TABLE `rooms`;--> statement-breakpoint
ALTER TABLE `__new_rooms` RENAME TO `rooms`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `rooms_room_number_unique` ON `rooms` (`room_number`);