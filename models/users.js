const db = require('../dbconfig/index');
const {DataTypes} = require('sequelize');
const bcrypt = require('bcrypt');



const Users = db.define('users',{
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
     db.sync();  

const createUser = async function(name,username,email,password){
    const hashedPassword = await bcrypt.hashSync(password,10)
    Users.create({name,username,email,password:hashedPassword});
}

const findUser = async function(username, password,email) {
    try {
        const user = await Users.findOne({ where: { username} });

        if (user) {
            const result = bcrypt.compareSync(password, user.password);
            if (result) {
                return user;
            }
        } else {
            return user;
        }
    } catch (error) {
        console.log(`Error Finding users:`, error);
        throw error;
    }
};

module.exports= {
    Users,
    createUser,
    findUser,
};