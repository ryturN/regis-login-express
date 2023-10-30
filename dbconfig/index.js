const Sequelize = require('sequelize');
const dotenv= require('dotenv');

dotenv.config();

const db = new Sequelize(
    'db_users',
    'root',
    'ryan14',
    {
        host : 'localhost',
        dialect: 'mysql',
    }
)

module.exports = db