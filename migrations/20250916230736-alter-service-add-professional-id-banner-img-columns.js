'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('service', 'professional_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'professional',
        key: 'id',
      },
    });
    await queryInterface.addColumn('service', 'banner_img', {
      type: Sequelize.STRING(255),
      allowNull: true,
    });

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('service', 'professional_id');
    await queryInterface.removeColumn('service', 'banner_img');
  }
};
