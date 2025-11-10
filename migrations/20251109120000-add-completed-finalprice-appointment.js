"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("appointment", "completed_at", {
      type: Sequelize.DATE,
      allowNull: true,
    });

    await queryInterface.addColumn("appointment", "final_price", {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true,
    });

    // composite index to accelerate provider+status+completed_at queries
    await queryInterface.addIndex("appointment", [
      "professional_id",
      "status",
      "completed_at",
    ], {
      name: "idx_prof_status_completed_at",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex("appointment", "idx_prof_status_completed_at");
    await queryInterface.removeColumn("appointment", "final_price");
    await queryInterface.removeColumn("appointment", "completed_at");
  },
};
