const mysql = require('mysql2/promise');

const configs = require('../config/config');

const db = mysql.createPool({
    host: configs.DB.HOST,
    user: configs.DB.USER,
    password: configs.DB.PASSWORD,
    database: configs.DB.DB,
    port: configs.DB.PORT,
});

module.exports = db;