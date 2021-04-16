const {PUBLIC_PORT, MONGO_URI} = require("./config/appConfig");

// Library imports
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Basic config
// Creates express app
const app = express();
app.use(cors());
// Parse requests of content-type - application/json
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}).then(() => {
    console.log("Successfully connected to the database");
}).catch(err => {
    console.log(`Could not connect to the database. Exiting now...${err}`);
    // process.exit();
});

// Require ednPoint routes
require('./api/routes/cartRoutes')(app);

// Listen for requests
const server = app.listen(PUBLIC_PORT, () => {
    console.log(`Server is listening on port ${PUBLIC_PORT}`);
})

// Enabling Graceful Shutdown
process.on('SIGTERM', () => {
    console.log('Closing server.');
    server.close(() => {
        console.log('Server closed.');
        console.log('Closing MongoDB connection.');
        mongoose.connection.close(false, () => {
            console.log('MongoDB connection closed. Exiting now');
            process.exit(0);
        });
    });
});