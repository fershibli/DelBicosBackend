import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database';

const Partner = sequelize.define('Partner', {
  nome: DataTypes.STRING,
  descricao: DataTypes.TEXT,
  endereco: DataTypes.STRING,
  fotoPerfil: DataTypes.STRING,
  notaMedia: DataTypes.FLOAT,
});

export default Partner;
