"use strict";

const { DataTypes } = require("sequelize");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("appointment", {
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
      client_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "client",
          key: "id",
        },
      },
      service_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "service",
          key: "id",
        },
      },
      address_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "address",
          key: "id",
        },
      },
      start_time: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      end_time: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("pending", "confirmed", "completed", "canceled"),
        defaultValue: "pending",
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
      "appointment",
      ["professional_id", "start_time", "end_time"],
      {
        name: "idx_appointment_times",
      }
    );
    await queryInterface.addIndex("appointment", ["status", "start_time"], {
      name: "idx_status_check",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("appointment");
  },
};
