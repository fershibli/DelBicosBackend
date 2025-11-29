/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const welcomeNotifications = [];
    const NUM_USERS = 10;
    
    for (let i = 1; i <= NUM_USERS; i++) {
      welcomeNotifications.push({
        user_id: i,
        title: "🎉 Bem-vindo(a) à Delbicos!",
        message: 
          "Obrigado por se juntar a nós. Estamos felizes em tê-lo(a) a bordo. Explore todos os nossos recursos!",
        is_read: false,
        notification_type: "system",
        related_entity_id: null,
        created_at: new Date(),
        updated_at: new Date(),
      });
    }

    await queryInterface.bulkInsert("notifications", welcomeNotifications, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("notifications", {
        notification_type: "system",
        title: "🎉 Bem-vindo(a) à Delbicos!"
    }, {});
  },
};