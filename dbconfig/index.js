const Sequelize = require('sequelize');
const dotenv= require('dotenv');

dotenv.config();

const db = new Sequelize(
    'db_testing',
    'root',
    'ryan14',
    {
        host : 'localhost',
        dialect: 'mysql',
        logging: true,
    }
)



module.exports = db