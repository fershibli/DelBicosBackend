"use strict";

const { DataTypes } = require("sequelize");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("address", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      lat: {
        type: DataTypes.DECIMAL(10, 8),
        allowNull: false,
      },
      lng: {
        type: DataTypes.DECIMAL(11, 8),
        allowNull: false,
      },
      street: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      number: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },
      complement: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      neighborhood: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      city: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      state: {
        type: DataTypes.STRING(2),
        allowNull: false,
      },
      country_iso: {
        type: DataTypes.STRING(2),
        allowNull: false,
      },
      postal_code: {
        type: DataTypes.STRING(8),
        allowNull: false,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    });
    await queryInterface.addIndex("address", ["active"], {
      unique: false,
      name: "active_index_address",
    });
    await queryInterface.addIndex("address", ["lat", "lng"], {
      type: "SPATIAL",
      name: "idx_location",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("address");
    await queryInterface.removeIndex("address", "active_index_address");
    await queryInterface.removeIndex("address", "idx_location");
  },
};
