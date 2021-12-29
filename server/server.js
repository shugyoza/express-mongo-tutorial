// This file is the main entry point for Express server and configuration initialization

// loads the configuration from config.env to process.env
require('dotenv').config({ path: './config.env' });

const express = require('express');
const cors = require('cors');
// get mongoDB driver connection
const dbo = require('./db/conn');

const PORT = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());
app.use(require('./routes/record'));

// Global error handling
// * without next, console & browser prints error stack res.status / res.send is not a function
// error handling midware always takes four arguments. We must provide four arguments to identify
//   it as error handler, even if we don't need it. Else, the next object will be interpreted as
//   regular midware and will fail to handle errors
// Ref.:  https://expressjs.com/ru/api.html
// https://github.com/visionmedia/supertest/issues/416
app.use(function (err, _req, res, next) {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// GET route for the root
app.get('/', (req, res) => {
    res.send('OK!')
})

// perform a database connection when the server starts
dbo.connectToServer((err) => {
    if (err) {
        console.error(err);
        process.exit();
    }

    // start the Express server
    app.listen(PORT, () => {
        console.log(`Listening on port: ${PORT}`)
    });
});
