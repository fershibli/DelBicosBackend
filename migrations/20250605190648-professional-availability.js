"use strict";

const { DataTypes } = require("sequelize");

/**CREATE TABLE professional_availability (
    id INT AUTO_INCREMENT PRIMARY KEY,
    professional_id INT NOT NULL,
    days_of_week VARCHAR(7) DEFAULT '0000000', -- Bitmask (Dom=primeiro, Sáb=último). Ex: Seg-Sex = '0111110'
    start_day_of_month INT CHECK (start_day_of_month BETWEEN 1 AND 31) DEFAULT NULL, -- Dia do mês inicial (opcional)
    end_day_of_month INT CHECK (start_day_of_month BETWEEN 1 AND 31) DEFAULT NULL, -- Dia do mês final (opcional)
    CHECK (start_day_of_month <= end_day_of_month),
    start_day DATE, -- Data inicial da disponibilidade (opcional)
    end_day DATE, -- Data final (opcional)
    start_time TIME NOT NULL, -- Horário de início (ex: 09:00:00)
    end_time TIME NOT NULL -- Horário de término (ex: 18:00:00)
    is_available BOOLEAN DEFAULT TRUE,
    recurrence_pattern ENUM('none', 'daily', 'weekly', 'monthly') DEFAULT 'none',
    FOREIGN KEY (professional_id) REFERENCES professional(id),
    INDEX idx_recurrence_combo (professional_id, recurrence_pattern, start_day, end_day)
); */

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("profesisonal-availability", {
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
    });
    await queryInterface.addIndex(
      "profesisonal-availability",
      ["professional_id", "recurrence_pattern", "start_day", "end_day"],
      {
        name: "idx_recurrence_combo",
      }
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("profesisonal-availability");
    await queryInterface.removeIndex(
      "profesisonal-availability",
      "idx_recurrence_combo"
    );
  },
};
