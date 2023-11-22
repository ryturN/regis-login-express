const { Op } = require("sequelize");
const db = require("../../dbconfig/index");
const projectsTable = require("../projectsTable");
const { nanoid } = require("nanoid");

// --------------------------------------------------- PROJECTS TABLE FUNCTIONS
const newProject = async (data) => {
    const { project_name, project_desc, user_id, deadline, project_category } = data;
    if(user_id === "") {
        return false;
    }

    // Checking if user is already post a project or not.
    const result = await projectsTable.findOne({
        where: {
            user_id: user_id
        }
    });
    if(result){
        return false;
    };
    // Make a new project data
    const newData = {
        project_id: 'projects_'+nanoid(16),
        project_name: project_name,
        project_desc: project_desc,
        user_id: user_id,
        deadline: deadline,
        project_category
    };
    projectsTable.create(newData);
    return true;
};

const deleteProject = async (data) => {
    const { user_id, project_id } = data;
    const isDataExist = await projectsTable.findOne({
        where: {
            [Op.or] : [
                {user_id: user_id},
                {project_id: project_id}
            ]
        }
    });
    if(!isDataExist) {
        return false;
    }
    projectsTable.destroy({
        where: {
            [Op.or]: [
                {user_id: user_id},
                {project_id: project_id}
            ]
        }
    });
    return true;
};

const searchProjectsAll = async () => {
    const result = await projectsTable.findAll();
    return result
}

const searchProjectsFilter = async (filter, value) => {
    if(filter == "project_id") {
        const result = await projectsTable.findAll({
            where: {
                project_id: {
                    [Op.substring]: value
                }
            }
        });
        return result;
    }else if(filter == "project_name") {
        const result = await projectsTable.findOne({
            where: {
                project_name: {
                    [Op.substring]: value
                }
            }
        });
        return result;
    }
}

const updateProjects = async (data) => {
    const { project_name, project_desc, project } = data;
}

// 

module.exports = {
    newProject,
    deleteProject,
    searchProjectsAll,
    searchProjectsFilter
}
