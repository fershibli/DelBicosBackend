import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('dougl947_Delbicos', 'dougl947_ScrumMaster', 'LUJZXeiw!j+W', {
  host: '162.241.2.230',
  dialect: 'mysql',
  logging: false, // opcional: desativa logs SQL no console
});

export const connectDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection to the database has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

export default sequelize;
