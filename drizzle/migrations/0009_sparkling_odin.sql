CREATE TABLE `shipping_address` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`full_name` varchar(100) NOT NULL,
	`phone` varchar(20) NOT NULL,
	`province` varchar(100) NOT NULL,
	`district` varchar(100) NOT NULL,
	`city` varchar(100) NOT NULL,
	`address` text NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `shipping_address_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `shipping_address` ADD CONSTRAINT `shipping_address_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;