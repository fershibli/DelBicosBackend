"use strict";

const { DataTypes } = require("sequelize");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("professional_availability", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      professional_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "professional",
          key: "id",
        },
      },
      days_of_week: {
        type: DataTypes.STRING(7),
        defaultValue: "0000000", // Bitmask for days of the week
      },
      start_day_of_month: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
          min: 1,
          max: 31,
        },
      },
      end_day_of_month: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
          min: 1,
          max: 31,
        },
      },
      start_day: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      end_day: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      start_time: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      end_time: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      is_available: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      recurrence_pattern: {
        type: DataTypes.ENUM("none", "daily", "weekly", "monthly"),
        defaultValue: "none",
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
    await queryInterface.addIndex(
      "professional_availability",
      ["professional_id", "recurrence_pattern", "start_day", "end_day"],
      {
        name: "idx_recurrence_combo",
      }
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("professional_availability");
  },
};
