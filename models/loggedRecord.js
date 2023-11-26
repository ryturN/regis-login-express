const { DataTypes, Sequelize } = require("sequelize");
const db = require("../dbconfig/index");

const loggedFreelanceRecord = {
    nomor: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    freelancerId: {
        type: DataTypes.STRING,
    },
    loggedRecord: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    logoutRecord: {
        type: DataTypes.NOW,
        defaultValue: 'NULL'
    }
}


const loggedUsersRecord ={
    nomor: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    consumersId: {
        type: DataTypes.STRING,
    },
    loggedRecord: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    logoutRecord: {
        type: DataTypes.NOW,
        defaultValue: 'NULL'
    }
}


module.exports = {loggedFreelanceRecord,loggedUsersRecord}