module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('category', 'image_url', {
      type: Sequelize.STRING(255),
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('category', 'image_url');
  }
};