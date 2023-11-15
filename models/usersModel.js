const db = require('../dbconfig/index');
const {DataTypes} = require('sequelize');


const userModel = {
    nomor:{
        type: DataTypes.INTEGER,
        unique: true,
        autoIncrement: true,
    },
    consumerId:{
        type: DataTypes.STRING,
        primaryKey: true
    },  
    fullName:{
        type: DataTypes.STRING
    },
    username:{
        type: DataTypes.STRING,
        unique: true,
    },
    email:{
        type: DataTypes.STRING,
        unique: true,
    },
    password:{
        type: DataTypes.STRING
    },
    telephoneNumber:{
        type: DataTypes.INTEGER,
    },
    nationalId:{
        type: DataTypes.STRING,
    },
    specialPoint:{
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },

} 

module.exports={
    userModel
}