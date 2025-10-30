'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('professional_availability', [
      {
        professional_id: 1,
        days_of_week: '0111110', // Segunda a Sexta (0:Dom, 1:Seg, 1:Ter, 1:Qua, 1:Qui, 1:Sex, 0:Sáb)
        start_time: '09:00:00',
        end_time: '18:00:00',
        recurrence_pattern: 'weekly',
        is_available: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        professional_id: 1,
        days_of_week: '0000001', // Sábado
        start_time: '09:00:00',
        end_time: '13:00:00',
        recurrence_pattern: 'weekly',
        is_available: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        professional_id: 1,
        days_of_week: '1111111', // Todos os dias
        start_time: '18:00:00',
        end_time: '22:00:00',
        recurrence_pattern: 'weekly',
        is_available: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        professional_id: 1,
        start_day: new Date('2024-12-23'),
        end_day: new Date('2024-12-27'),
        start_time: '08:00:00',
        end_time: '20:00:00',
        recurrence_pattern: 'none',
        is_available: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        professional_id: 1,
        start_day_of_month: 20,
        end_day_of_month: 31,
        start_time: '07:00:00',
        end_time: '22:00:00',
        recurrence_pattern: 'monthly',
        is_available: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        professional_id: 1,
        start_day: new Date('2025-01-10'),
        end_day: new Date('2025-01-31'),
        start_time: '00:00:00',
        end_time: '23:59:59',
        recurrence_pattern: 'none',
        is_available: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        professional_id: 1,
        start_day: new Date('2024-11-15'),
        end_day: new Date('2024-11-15'),
        start_time: '10:00:00',
        end_time: '16:00:00',
        recurrence_pattern: 'none',
        is_available: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('professional_availability', { professional_id: 1 }, {});
  },
};