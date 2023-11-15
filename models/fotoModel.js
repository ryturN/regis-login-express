const db = require('../dbconfig/index');
const {DataTypes} = require('sequelize');

const fotoUrl={
    fotoImg: {
        type: DataTypes.STRING
    },
}


module.exports = {
    fotoUrl,
}