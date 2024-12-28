require('dotenv').config()
const  Pool = require('pg').Pool;

const pool = new Pool({
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    database: process.env.DB,
    port: process.env.DB_PORT,
});

module.exports = pool;