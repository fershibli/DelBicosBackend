"use strict";

const { DataTypes } = require("sequelize");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("admin_service_order", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      appointment_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "appointment",
          key: "id",
        },
      },
      title: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING(1000),
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("pending", "in_progress", "completed", "canceled"),
        defaultValue: "pending",
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    });
    await queryInterface.addIndex(
      "admin_service_order",
      ["status", "created_at"],
      {
        name: "idx_status_check",
      }
    );
    await queryInterface.addIndex(
      "admin_service_order",
      ["appointment_id", "status"],
      {
        name: "idx_appointment_check",
      }
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("admin_service_order");
    await queryInterface.removeIndex("admin_service_order", "idx_status_check");
    await queryInterface.removeIndex(
      "admin_service_order",
      "idx_appointment_check"
    );
  },
};
