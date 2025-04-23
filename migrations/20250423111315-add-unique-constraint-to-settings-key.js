module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint('Settings', {
      fields: ['key'],
      type: 'unique',
      name: 'unique_key_constraint' // name is optional but helpful
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('Settings', 'unique_key_constraint');
  }
};
