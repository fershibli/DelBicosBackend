"use strict";

const { DataTypes } = require("sequelize");

/*
CREATE TABLE service (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    duration INT NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    category_id INT NOT NULL,
    FOREIGN KEY (category_id) REFERENCES category(id),
    INDEX active_index_service (active)
);
 */

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("service", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      title: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      duration: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      category_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "category",
          key: "id",
        },
      },
    });
    await queryInterface.addIndex("service", ["active"], {
      name: "active_index_service",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("service");
    await queryInterface.removeIndex("service", "active_index_service");
  },
};
