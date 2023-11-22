const { DataTypes, Sequelize } = require("sequelize");
const db = require("../dbconfig/index");

const projectsTable = db.define('projects', {
    project_id: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    project_name: {
        type: DataTypes.STRING
    },
    project_desc: {
        type: DataTypes.STRING
    },
    user_id: {
        type: DataTypes.STRING
    },
    deadline: {
        type: DataTypes.DATEONLY
    },
    project_category: {
        type: DataTypes.ARRAY(Sequelize.TEXT)
    }
});

projectsTable.sync().then(() => {
    console.log('Projects table is synchronized!')
});

module.exports = projectsTable;