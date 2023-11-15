const db = require('../dbconfig/index');
const {DataTypes} = require('sequelize');
const bcrypt = require('bcrypt');
const { freelancers } = require('./freelancerModel');
const { fotoUrl } = require('./fotoModel')
const { userModel } = require ('./usersModel')


const freelancerTable= db.define('freelancer',freelancers,
{
    freezeTableName: true
})

const foto= db.define('fotoDb',fotoUrl,
{
    freezeTableName: true
})

const Users = db.define('users',userModel,
{
    freezeTableName: true,
})
        // db.drop().then(()=>{

            db.sync(); 
        // })

// foto.hasOne(freelancerTable,{
//     foreignKey: "id"
// })

// freelancerTable.belongsTo(foto,{
//     foreignKey: "id"
// })

module.exports = {
    freelancerTable,
    foto,
    Users
}