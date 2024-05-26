import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import {insert} from './db_init.js';

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.post('/insert', (req, res) => {
    const data = {
        $date: req.body.date,
        $result: req.body.result
    };

    insert.run(data, function(err) {
        if (err) {
            console.error(err.message);
            res.status(500).send('Error inserting data');
        } else {
            console.log(`A row has been inserted with rowid ${this.lastID}`);
            res.send('Data inserted successfully');
        }
    });
});

// Serve the index.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'..', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
