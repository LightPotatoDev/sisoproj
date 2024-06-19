const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const axios = require('axios');

const app = express();
const port = 3000;

require('dotenv').config();

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'dist')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname));

// Serve the index.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.ejs'));
    res.render('index', {entries:[]});
});

const db_path = 'C:/Users/light/OneDrive/바탕 화면/sys/project/db/quiz.db';
const db = new sqlite3.Database(db_path, (err) => {
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

app.post('/generate-response', async (req, res) => {
    const { sys, user } = req.body;

    try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            response_format: { type: 'json_object' },
            messages: [
                { role: 'system', content: sys },
                { role: 'user', content: user }
            ],
            model: 'gpt-3.5-turbo'
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
            }
        });

        res.json(response.data);
    } catch (error) {
        console.error('Error communicating with OpenAI API:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
