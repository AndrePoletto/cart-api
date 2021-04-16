// .env file config
require('dotenv').config();

const config = {
    MONGO_URI: process.env.MONGO_URI || "mongodb://challenge-dev:p4ssw0rd@0.0.0.0:27017/ecommerce",
    PUBLIC_PORT: process.env.PUBLIC_PORT || 8080
};

module.exports = config;