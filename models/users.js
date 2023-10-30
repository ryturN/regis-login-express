const dbConfig = require('../dbconfig/index');
const {DataTypes} = require('sequelize');
const bcrypt = require('bcrypt');



exports.Users = dbConfig.define('users',{
    name:{
        type: DataTypes.STRING
    },
    username:{
        type: DataTypes.STRING
    },
    email:{
        type: DataTypes.STRING
    },
    password:{
        type: DataTypes.STRING
    },
},
{
    freezeTableName: true,
})




