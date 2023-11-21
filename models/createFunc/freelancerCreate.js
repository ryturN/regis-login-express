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
const updateFreelancerPassword = async function(password){
    const hashedPassword = await bcrypt.hashSync(password,10)
    freelancerTable.update({
        password:hashedPassword
    });
}

const findFreelancer = async function(username, password) {
    try {
        const user = await freelancerTable.findOne({ where: { username } });
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
    updateFreelancerPassword,
    findFreelancer
}