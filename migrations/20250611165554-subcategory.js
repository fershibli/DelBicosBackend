"use strict";
import { DataTypes } from "sequelize";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("subcategory", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      title: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      category_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "category",
          key: "id",
        },
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("subcategory");
  },
};
