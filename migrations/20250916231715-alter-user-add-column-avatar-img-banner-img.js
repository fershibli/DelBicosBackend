"use strict";

const { DataTypes } = require("sequelize");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("users", "avatar_img", {
      type: DataTypes.STRING(255),
      allowNull: true,
    });
    await queryInterface.addColumn("users", "banner_img", {
      type: DataTypes.STRING(255),
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("users", "avatar_img");
    await queryInterface.removeColumn("users", "banner_img");
  },
};
