"use strict";

const { DataTypes } = require("sequelize");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("professional_availability_lock", {
      professional_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "professional",
          key: "id",
        },
        primaryKey: true,
      },
      start_time: {
        type: DataTypes.DATE,
        allowNull: false,
        primaryKey: true,
      },
      end_time: {
        type: DataTypes.DATE,
        allowNull: false,
        primaryKey: true,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("professional_availability_lock");
  },
};
