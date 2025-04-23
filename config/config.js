require('dotenv').config();

module.exports = {
  "development": {
    "username": process.env.DB_USERNAME || "root",
    "password": process.env.DB_PASSWORD || null,
    "database": process.env.DB_NAME || "database_development",
    "host": process.env.DB_HOST || "mysql",
    "dialect": process.env.DB_DIALECT || "mysql",
  },
  "test": {
    "username": process.env.DB_USERNAME || "root",
    "password": process.env.DB_PASSWORD || null,
    "database": process.env.DB_NAME || "database_test",
    "host": process.env.DB_HOST || "mysql"
  },
  "production": {
    "username": process.env.DB_USERNAME || "root",
    "password": process.env.DB_PASSWORD || null,
    "database": process.env.DB_NAME || "database_production",
    "host": process.env.DB_HOST || "mysql"
  }
};