CREATE TABLE `product` (
	`id` int AUTO_INCREMENT NOT NULL,
	`productname` varchar(255) NOT NULL,
	`SKU` varchar(255) NOT NULL,
	`category` enum('clothing','mobile','sprots') NOT NULL,
	`price` int NOT NULL,
	`stock` int NOT NULL,
	`status` enum('in-stock','low-stock','out-of-stock') NOT NULL,
	CONSTRAINT `product_id` PRIMARY KEY(`id`)
);
