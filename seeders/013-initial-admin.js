"use strict";
const bcrypt = require("bcryptjs");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const salt = await bcrypt.genSalt(10);
    const now = new Date();

    const adminEmail = 'admin@delbicos.com.br';
    // Insert admin user
    await queryInterface.bulkInsert('users', [
      {
        name: 'Administrador DelBicos',
        email: adminEmail,
        phone: '5515990000000',
        password: await bcrypt.hash('admin123', salt),
        avatar_uri: 'https://i.pravatar.cc/150?img=10',
        banner_uri: 'https://picsum.photos/seed/admin/800/200',
        created_at: now,
        updated_at: now,
      },
    ]);

    // Retrieve the inserted user id
    const results = await queryInterface.sequelize.query(
      'SELECT id FROM users WHERE email = ? LIMIT 1',
      {
        replacements: [adminEmail],
        type: queryInterface.sequelize.QueryTypes.SELECT,
      }
    );

    const user = Array.isArray(results) ? results[0] : results;
    const userId = user && user.id ? user.id : null;
    if (userId) {
      await queryInterface.bulkInsert('admin', [
        {
          user_id: userId,
          created_at: now,
          updated_at: now,
        },
      ]);
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('admin', { /* will delete by user later */ }, {});
    await queryInterface.bulkDelete('users', { email: 'admin@delbicos.com.br' }, {});
  },
};
