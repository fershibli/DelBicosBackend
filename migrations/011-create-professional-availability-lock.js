"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("professional_availability_lock", {
      professional_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "professional",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        primaryKey: true,
      },
      start_time: {
        type: Sequelize.DATE,
        allowNull: false,
        primaryKey: true,
      },
      end_time: {
        type: Sequelize.DATE,
        allowNull: false,
        primaryKey: true,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("professional_availability_lock");
  },
};
