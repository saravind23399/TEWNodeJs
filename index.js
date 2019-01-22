//Module Imports
const express = require('express');
const config = require('./Config/app.config')
const cors = require('cors')
const http = require('http');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

//Route imports
const userRoute = require('./Routes/userRoute')

//Environment Setup
const port = process.env.PORT || 3000
var production = true;
const app = express();


// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

//Mongoose Configuration
//Connect to Database
mongoose.connect(config.database.name, {
    useNewUrlParser: true
});

//Callback upon successfull Connection
mongoose.connection.on('connected', () => {
    console.log('Connected to Database ' + config.database.name);
});

//Callback upon unsuccessfull Connection
mongoose.connection.on('error', (err) => {
    console.log('Database error ' + err);
});

//Routes
app.use('/users', userRoute)

//Test Route
app.get('/test', (req, res) => {
    res.send('HELLO WORLD!');
});


// Index Route
if (production) {

    var distDir = __dirname + "/dist/TEWAngularJs/";

    app.use('/', express.static(distDir));

    app.get('*', (req, res) => {
        res.sendFile(distDir + "index.html");
    });

    app.listen(port, () => {
        console.log('Server started on port ' + port);
    });
    app.use(express.static(distDir));
} else {
    app.get('/', (req, res) => {
        res.send('HELLO WORlD!');
    });

    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'public/index.html'));
    });

    // Start Server
    app.listen(port, () => {
        console.log('Server started on port ' + port);
    });
}

app.use('/upload', express.static('upload'));