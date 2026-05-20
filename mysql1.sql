CREATE DATABASE IF NOT EXISTS user_db;
USE user_db;

CREATE TABLE users (
	id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(30) NOT NULL UNIQUE,
    password VARCHAR(30) NOT NULL
);
INSERT INTO users (username,password) VALUES
('mabohao','123456'),
('admin','666666'),
('mbh','mbh123');