const db = require('../dbconfig/index');
const { freelancers } = require('./freelancerModel');
const { fotoUrl } = require('./fotoModel')
const { userModel } = require ('./usersModel')
const skillsTable = require('./skills');
const {loggedFreelanceRecord,loggedUsersRecord} = require('./loggedRecord');


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
const skillsTables = db.define('skills',skillsTable,
{
    freezeTableName: true,
})
const recordFreelancer = db.define('recordFreelancer',loggedFreelanceRecord,{
        freezeTableName: true,
        createdAt: false,
        updatedAt: false
})
const recordUsers = db.define('recordUsers',loggedUsersRecord,{
        freezeTableName: true,
        createdAt: false,
        updatedAt: false
})


        // db.drop().then(()=>{

            db.sync().then(()=>{
                console.log('database sync!')
            }); 
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
    Users,
    skillsTables,
    recordFreelancer,
    recordUsers
}