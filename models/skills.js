const { DataTypes, Sequelize } = require("sequelize");
const db = require("../dbconfig/index");



const skills = {
    nomor: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    freelancerId: {
        type: DataTypes.STRING,
    },
    skills: {
        type: DataTypes.STRING,
    },
}

module.exports = skills