const {recordUsers,recordFreelancer} = require('../table');

const createUsersRecord = async function (getId){
    recordUsers.create({
        consumersId:getId,
    })
}
const createFreelanceRecord = async function (getId){
    recordFreelancer.create({
        consumerId:getId,
    })
}

module.exports = {createUsersRecord,createFreelanceRecord}