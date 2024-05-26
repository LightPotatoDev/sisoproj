import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import webpack from 'webpack';
import webpackHotMiddleware from 'webpack-hot-middleware';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackConfig from './webpack.config.cjs';
import {insert} from './src/db_init.js';

const app = express();
const port = 3000;
const complier = webpack(webpackConfig);

app.use(bodyParser.json());
app.use(webpackDevMiddleware(complier, {
    publicPath: webpackConfig.output.publicPath
}));
app.use(webpackHotMiddleware(complier));

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
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
