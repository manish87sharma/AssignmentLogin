PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS Users (
	ID INTEGER PRIMARY KEY AUTOINCREMENT,
	UserName VARCHAR(200),
	Password VARCHAR(200),
	FirstName VARCHAR(200),
	LastName VARCHAR(200),
	Country VARCHAR(100),
	Gender VARCHAR(50) ,
	Email VARCHAR(200),
	Created_Date date default CURRENT_DATE
);

-- check(type="Male" or type="Female")
