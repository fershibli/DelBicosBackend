import { Sequelize } from 'sequelize';

const sequelizeInstance = new Sequelize('dougl947_Delbicos', 'dougl947_ScrumMaster', '[orAH(EiSHC9', {
    host: '162.241.2.230',
    port: 3306,
    dialect: 'mysql',
    dialectOptions: {
        connectTimeout: 60000,
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    },
    logging: console.log
});

export const connectDatabase = async () => {
    try {
        await sequelizeInstance.authenticate();
        console.log('Conexão estabelecida com sucesso!');
        await sequelizeInstance.sync({ alter: true });
        return sequelizeInstance;
    } catch (error) {
        console.error('Erro na conexão:', error);
        process.exit(1);
    }
};

export const sequelize = sequelizeInstance;