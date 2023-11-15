const bcrypt = require('bcrypt');
const { Users } =require('../table')


const createUser = async function(consumerId,fullName,username,email,password){
    const hashedPassword = await bcrypt.hashSync(password,10)
    Users.create({consumerId,fullName,username,email,password:hashedPassword});
}
const updateUser = async function(name,username,email,password){
    const hashedPassword = await bcrypt.hashSync(password,10)
    Users.update({name,username,email,password:hashedPassword});
}

const findUser = async function(username, password,email) {
    try {
        const user = await Users.findOne({ where: { username} });
        console.log(user)
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
    createUser,
    findUser,
    updateUser
};