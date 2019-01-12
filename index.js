const express = require('express');
const config = require('./Config/app.config')
const cors = require('cors')
const http = require('http');
const mongoose = require('mongoose');

const port = process.env.PORT || 3000
var production = false;
const app = express();

if (production) {
    app.use(cors({ origin: 'http://site.to.be.deployed' }));
} else {
    app.use(cors({ origin: 'http://localhost:3000' }));
}

mongoose.connect(config.database.name, { useNewUrlParser: true });

mongoose.connection.on('connected', () => {
    console.log('Connected to Database ' + config.database.name);
});

mongoose.connection.on('error', (err) => {
    console.log('Database error ' + err);
});

app.get('/', (req, res) => {
    res.send('HELLO WORLD!');
});

app.listen(port, () => {
    console.log('Server started on port ' + port);
});