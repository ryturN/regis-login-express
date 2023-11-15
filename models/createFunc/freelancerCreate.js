const bcrypt = require('bcrypt');
const { freelancerTable } = require('../table')
const { Op } = require('sequelize')

const createFreelancer = async function(freelancer_id,fullName,username,email,password){
    const hashedPassword = await bcrypt.hashSync(password,10)
    freelancerTable.create({
        freelancer_id,
        fullName,
        username,
        email,
        password:hashedPassword,
        });
}
const updateFreelancer = async function(name,username,email,password){
    const hashedPassword = await bcrypt.hashSync(password,10)
    freelancerTable.update({full_name,
        username,
        email,
        password:hashedPassword});
}

const findFreelancer = async function(username, password) {
    try {
        const user = await freelancerTable.findOne({ where: { username } });
        console.log(user);
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

module.exports = {
    createFreelancer,
    updateFreelancer,
    findFreelancer
}