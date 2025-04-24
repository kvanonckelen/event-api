require('dotenv').config();
const path = require('path');

module.exports = {
  "development": {
    storage: path.resolve(__dirname, "../database/database.sqlite"),
    dialect: "sqlite",
    logging: true,
  },
  "production": {
    "username": process.env.DB_USERNAME || "root",
    "password": process.env.DB_PASSWORD || null,
    "database": process.env.DB_NAME || "database_production",
    "host": process.env.DB_HOST || "mysql",
    "dialect": process.env.DB_DIALECT || "mysql",
    "logging": process.env.DB_LOGGING || false
  }
};