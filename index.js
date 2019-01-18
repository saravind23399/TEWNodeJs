//Module Imports
const express = require('express');
const config = require('./Config/app.config')
const cors = require('cors')
const http = require('http');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

//Route imports
const userRoute = require('./Routes/userRoute')

//Environment Setup
const port = process.env.PORT || 3000
var production = false;
const app = express();


// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//CORS Control
if (production) {
    app.use(cors({ origin: 'http://site.to.be.deployed' }));
} else {
    app.use(cors({ origin: 'http://localhost:3000' }));
}

//Mongoose Configuration
//Connect to Database
mongoose.connect(config.database.name, { useNewUrlParser: true });

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
app.get('/', (req, res) => {
    res.send('HELLO WORLD!');
});

//Creates a server to listen on PORT
app.listen(port, () => {
    console.log('Server started on port ' + port);
});