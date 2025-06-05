"use strict";

const { DataTypes } = require("sequelize");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("professional", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      main_address_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "address",
          key: "id",
        },
      },
      cpf: {
        type: DataTypes.STRING(14),
        allowNull: false,
        unique: true,
      },
      cnpj: {
        type: DataTypes.STRING(18),
        allowNull: true,
        unique: true,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("professional");
  },
};
