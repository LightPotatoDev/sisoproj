const express = require('express');
const bodyParser = require('body-parser');
const Database = require('better-sqlite3');
const app = express();
const port = 3000;

const db = new Database('database/quiz.db');

db.exec(`
    CREATE TABLE IF NOT EXISTS results (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT NOT NULL,
        result TEXT NOT NULL
    )
`);

app.use(bodyParser.json());
app.use(express.static('public'));

app.post('/submit', (req, res) => {
    const { result } = req.body;
    const date = new Date().toISOString();

    const stmt = db.prepare('INSERT INTO results (date, result) VALUES (?, ?)');
    stmt.run(date, result);

    res.sendStatus(200);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
