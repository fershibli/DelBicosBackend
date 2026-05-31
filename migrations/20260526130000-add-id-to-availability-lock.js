"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const dialect = queryInterface.sequelize.getDialect();

    if (dialect === "postgres" || dialect === "postgresql") {
      await queryInterface.sequelize.query(`
        ALTER TABLE professional_availability_lock ADD COLUMN IF NOT EXISTS id SERIAL;
      `);
      await queryInterface.sequelize.query(`
        DO $$ BEGIN
          IF EXISTS (
            SELECT 1 FROM pg_constraint
            WHERE conname = 'professional_availability_lock_pkey'
              AND conrelid = 'professional_availability_lock'::regclass
          ) THEN
            ALTER TABLE professional_availability_lock DROP CONSTRAINT professional_availability_lock_pkey;
          END IF;
        END $$;
      `);
      await queryInterface.sequelize.query(`
        ALTER TABLE professional_availability_lock ADD PRIMARY KEY (id);
      `);
      await queryInterface.sequelize.query(`
        ALTER TABLE professional_availability_lock
          ADD CONSTRAINT uq_pal_professional_start_end
          UNIQUE (professional_id, start_time, end_time);
      `);
    } else {
      // MySQL
      await queryInterface.sequelize.query(`
        ALTER TABLE professional_availability_lock
          DROP PRIMARY KEY,
          ADD COLUMN id INT AUTO_INCREMENT PRIMARY KEY FIRST,
          ADD UNIQUE KEY uq_pal_professional_start_end (professional_id, start_time, end_time);
      `);
    }
  },

  async down(queryInterface, Sequelize) {
    const dialect = queryInterface.sequelize.getDialect();

    if (dialect === "postgres" || dialect === "postgresql") {
      await queryInterface.sequelize.query(`
        ALTER TABLE professional_availability_lock DROP CONSTRAINT IF EXISTS uq_pal_professional_start_end;
      `);
      await queryInterface.sequelize.query(`
        ALTER TABLE professional_availability_lock DROP COLUMN IF EXISTS id;
      `);
      await queryInterface.sequelize.query(`
        ALTER TABLE professional_availability_lock ADD PRIMARY KEY (professional_id, start_time, end_time);
      `);
    } else {
      await queryInterface.sequelize.query(`
        ALTER TABLE professional_availability_lock
          DROP PRIMARY KEY,
          DROP KEY uq_pal_professional_start_end,
          DROP COLUMN id,
          ADD PRIMARY KEY (professional_id, start_time, end_time);
      `);
    }
  },
};
