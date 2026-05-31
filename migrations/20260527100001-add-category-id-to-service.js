"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("service", "category_id", {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: { model: "category", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });

    await queryInterface.addIndex("service", ["category_id"], {
      name: "idx_service_category",
    });
  },

  async down(queryInterface) {
    await queryInterface.removeIndex("service", "idx_service_category");
    await queryInterface.removeColumn("service", "category_id");
  },
};
