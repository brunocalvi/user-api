CREATE TABLE `users` (
	`id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
	`name` VARCHAR(100),
	`email` VARCHAR(150) NOT NULL UNIQUE,
	`password` VARCHAR(200) NOT NULL,
	`role` INT 
);

CREATE TABLE `passwordtokens` (
	`id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
	`token` VARCHAR(200) NOT NULL,
	`user_id` INT NOT NULL,
	`used` TINYINT,
	FOREIGN KEY (user_id) REFERENCES users(id)
);

SELECT * FROM `users`;

SELECT * FROM `passwordtokens`;
