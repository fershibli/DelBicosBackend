"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const clients = await queryInterface.sequelize.query(
      `SELECT * FROM client ORDER BY id`,
      { type: Sequelize.QueryTypes.SELECT }
    );
    const professionals = await queryInterface.sequelize.query(
      `SELECT * FROM professional ORDER BY id`,
      { type: Sequelize.QueryTypes.SELECT }
    );
    const services = await queryInterface.sequelize.query(
      `SELECT * FROM service ORDER BY id`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (!clients.length || !professionals.length || !services.length) {
      throw new Error(
        "Dados insuficientes: certifique-se de que clients, professionals e services estejam populados antes de rodar este seeder."
      );
    }

    const appointments = [];
    const statuses = ["pending", "confirmed", "completed", "canceled"];
    const now = new Date();

    // Distribui dados de forma determinística por profissional, mês e cliente
    for (let pIndex = 0; pIndex < professionals.length; pIndex++) {
      const professional = professionals[pIndex];
      const profServices = services.filter((s) => s.professional_id === professional.id);
      if (!profServices.length) continue;

      // Últimos 12 meses
      for (let monthBack = 0; monthBack < 12; monthBack++) {
        const perMonth = 3 + ((professional.id + monthBack) % 5); // 3..7 por mês

        for (let a = 0; a < perMonth; a++) {
          const client = clients[(pIndex + monthBack + a) % clients.length];
          const service = profServices[(pIndex + a) % profServices.length];

          const appointmentDate = new Date(now);
          appointmentDate.setMonth(appointmentDate.getMonth() - monthBack);
          const day = 1 + ((pIndex + monthBack + a) % 25);
          appointmentDate.setDate(day);
          appointmentDate.setHours(9 + ((a + monthBack) % 8), 0, 0, 0);

          const startTime = new Date(appointmentDate);
          const endTime = new Date(appointmentDate);
          const durationMinutes = service.duration ? Number(service.duration) : 60;
          endTime.setMinutes(endTime.getMinutes() + durationMinutes);

          const statusIndex = (pIndex + monthBack + a) % statuses.length;
          const status = statuses[statusIndex];

          let rating = null;
          let review = null;
          let completed_at = null;
          let final_price = null;
          let payment_intent_id = null;

          if (status === "completed") {
            completed_at = new Date(startTime);
            // marca completed_at algumas horas depois para simular processamento
            completed_at.setHours(completed_at.getHours() + 1);

            const basePrice = service && service.price ? parseFloat(service.price) : 100.0;
            final_price = parseFloat((basePrice + ((pIndex + a) % 20)).toFixed(2));
            rating = ((pIndex + a) % 5) + 1; // 1..5
            review = null;
            payment_intent_id = `pi_volume_seed_${professional.id}_${client.id}_${monthBack}_${a}`;
          } else if (status === "confirmed") {
            payment_intent_id = `pi_volume_seed_${professional.id}_${client.id}_${monthBack}_${a}`;
          }

          appointments.push({
            professional_id: professional.id,
            client_id: client.id,
            service_id: service.id,
            address_id: client.main_address_id || null,
            start_time: startTime,
            end_time: endTime,
            status: status,
            rating: rating,
            review: review,
            completed_at: completed_at,
            final_price: final_price,
            payment_intent_id: payment_intent_id,
            created_at: now,
            updated_at: now,
          });
        }
      }
    }

    // Bulk insert
    await queryInterface.bulkInsert("appointment", appointments, {});
  },

  async down(queryInterface, Sequelize) {
    // Remove apenas os registros criados por este seeder (payment_intent_id com prefixo)
    await queryInterface.bulkDelete(
      "appointment",
      {
        payment_intent_id: {
          [Sequelize.Op.like]: "pi_volume_seed_%",
        },
      },
      {}
    );
  },
};
