const db = require('../dbconfig/index');
const {DataTypes} = require('sequelize');
const bcrypt = require('bcrypt');


const freelancers= {

    nomor:{
        type: DataTypes.INTEGER,
        unique: true,
        autoIncrement: true,
    },
    freelancer_id:{
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false
    },
    fullName:{
        type: DataTypes.STRING,
    },
    username:{
        type: DataTypes.STRING,
        unique: true
    },
    email:{
        type: DataTypes.STRING,
        unique: true,
    },
    password:{
        type: DataTypes.STRING,
    },
    telephoneNumber:{
        type: DataTypes.INTEGER,
    },
    nationalId:{
        type: DataTypes.STRING,
    },
    location:{
        type: DataTypes.STRING,
    },
    experiencePoint:{
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    skills: {
        type: DataTypes.STRING,
    },
    socialMedia: {
        type: DataTypes.STRING
    },
    Comment:{
        type: DataTypes.STRING
    },
}


module.exports= {
    freelancers
};