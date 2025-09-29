"use strict";

const { DataTypes } = require("sequelize");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("appointment", "rating", {
      type: DataTypes.INTEGER,
      allowNull: true,
    });

    await queryInterface.addColumn("appointment", "review", {
      type: DataTypes.STRING(1000),
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("appointment", "rating");
    await queryInterface.removeColumn("appointment", "review");
  },
};
