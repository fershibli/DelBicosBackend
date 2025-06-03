import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database';
import Partner from './Partner';

const Service = sequelize.define('Service', {
  nome: DataTypes.STRING,
  preco: DataTypes.STRING,
  duracao: DataTypes.STRING,
});

Service.belongsTo(Partner, { foreignKey: 'partnerId' });
Partner.hasMany(Service, { foreignKey: 'partnerId' });

export default Service;
