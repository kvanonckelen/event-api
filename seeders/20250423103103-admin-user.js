const bcrypt = require("bcrypt");

module.exports = {
  async up(queryInterface, Sequelize) {
    const hash = await bcrypt.hash("admin", 10);
    return queryInterface.bulkInsert("Users", [{
      username: "admin",
      password: hash,
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("Users", { username: "admin" });
  }
};
