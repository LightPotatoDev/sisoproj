import sqlite3 from 'sqlite3';
//const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('../db/quiz.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err){
        console.error(err.message);
    }
    console.log('connected to databasd');
})

db.exec(
    "CREATE TABLE IF NOT EXISTS quiz_result (id INTEGER PRIMARY KEY, date TEXT, result TEXT)"
);

const insert = db.prepare(
    "INSERT INTO quiz_result (date, result) VALUES ($date, $result)"
);

module.exports = {
    db,
    insert
}

/*
// Query the table
db.each("SELECT date, result FROM quiz_result", (err, row) => {
    if (err) {
    console.error(err.message);
    }
    console.log(row.date + "\t" + row.result);
});
    
// Close the database
db.close();
*/