"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("service", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      title: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      duration: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: "Duration in minutes",
      },
      active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      subcategory_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "subcategory",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      professional_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "professional",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      banner_uri: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
    await queryInterface.addIndex("service", ["active"], {
      name: "idx_service_active",
    });
    await queryInterface.addIndex("service", ["professional_id"], {
      name: "idx_service_professional",
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("service");
  },
};
