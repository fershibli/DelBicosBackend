"use strict";
import { DataTypes } from "sequelize";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      // Add the new subcategory_id column
      await queryInterface.addColumn("service", "subcategory_id", {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "subcategory",
          key: "id",
        },
        transaction,
      });

      await queryInterface.removeColumn("service", "category_id", {
        transaction,
      });
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.addColumn("service", "category_id", {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "category",
          key: "id",
        },
        transaction,
      });

      await queryInterface.removeColumn("service", "subcategory_id", {
        transaction,
      });
    });
  },
};
