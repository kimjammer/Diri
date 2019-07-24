const sqlite = require('sqlite3');
const db = new sqlite.Database('./db.sqlite');

db.serialize(() => {
	db.run("DROP TABLE IF EXISTS UserPoints;", error => {
		if (error) {
			throw error;
		};
	});
	db.run(`CREATE TABLE UserPoints
		(id INTEGER PRIMARY KEY NOT NULL 
		userId INTEGER NOT NULL 
		username TEXT 
		points INTEGER;`, error => {
			if (error) {
				
			};
		});
});