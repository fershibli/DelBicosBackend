"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("professional_availability_lock", "reason", {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.addColumn("professional_availability_lock", "created_by", {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: { model: "users", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn("professional_availability_lock", "created_by");
    await queryInterface.removeColumn("professional_availability_lock", "reason");
  },
};
