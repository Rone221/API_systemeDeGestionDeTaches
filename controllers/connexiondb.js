// config/database.js
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("gestionDeTaches", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

module.exports = sequelize;
