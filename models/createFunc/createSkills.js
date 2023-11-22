const {skillsTables} = require('../table');

const createSkills = async function (getId,skills){
    skillsTables.create({
        freelancerId:getId,
        skills
    })
}

module.exports = createSkills