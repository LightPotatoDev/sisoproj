const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'dist')));

// Serve the index.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const db_path = 'C:/Users/light/OneDrive/바탕 화면/sys/project/db/quiz.db';
const db = new sqlite3.Database(db_path, sqlite3.OPEN_READWRITE, (err) => {
    if (err){
        console.error(err.message);
    }
    console.log('connected to databasd');
})

db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS quiz_result (id INTEGER PRIMARY KEY, date TEXT, result TEXT)");
}); 

const insert = db.prepare(
    "INSERT INTO quiz_result (date, result) VALUES ($date, $result)"
);

app.post('/insert', (req, res) => {
    const data = {
        $date: req.body.date,
        $result: req.body.result
    };

    insert.run(data, function(err) {
        if (err) {
            console.error(err.message);
            console.log('A')
            res.status(500).send('Error inserting data');
        } else {
            console.log(`A row has been inserted with rowid ${this.lastID}`);
            res.status(200).send('Data inserted successfully');
        }
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
