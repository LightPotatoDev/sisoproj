// init_db.js
const sqlite3 = require('sqlite3').verbose();
// Connect to the database (it will create the database file if it doesn't exist)
const db = new sqlite3.Database('./chinook.db');

// Create the table
db.serialize(() => {
db.run(`CREATE TABLE IF NOT EXISTS my_table ( ID INTEGER PRIMARY KEY, Type TEXT )`);

// Insert sample data
const stmt = db.prepare("INSERT INTO my_table (Type) VALUES (?)");
stmt.run('A');
stmt.run('B');
stmt.run('C');
stmt.finalize();

// Query the table
db.each("SELECT ID, Type FROM my_table", (err, row) => {
if (err) {
console.error(err.message);
}
console.log(row.ID + "\t" + row.Type);
});
});

// Close the database
db.close();