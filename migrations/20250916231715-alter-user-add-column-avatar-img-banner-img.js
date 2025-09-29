"use strict";

const { DataTypes } = require("sequelize");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("users", "avatar_uri", {
      type: DataTypes.STRING(255),
      allowNull: true,
    });
    await queryInterface.addColumn("users", "banner_uri", {
      type: DataTypes.STRING(255),
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("users", "avatar_uri");
    await queryInterface.removeColumn("users", "banner_uri");
  },
};
