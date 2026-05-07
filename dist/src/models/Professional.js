"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfessionalModel = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
class ProfessionalModel extends sequelize_1.Model {
}
exports.ProfessionalModel = ProfessionalModel;
ProfessionalModel.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    user_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "users",
            key: "id",
        },
    },
    main_address_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: "address",
            key: "id",
        },
    },
    cpf: {
        type: sequelize_1.DataTypes.STRING(14),
        allowNull: false,
        unique: true,
    },
    cnpj: {
        type: sequelize_1.DataTypes.STRING(18),
        allowNull: true,
        unique: true,
    },
    description: {
        type: sequelize_1.DataTypes.STRING(1500),
        allowNull: true,
    },
}, {
    sequelize: database_1.sequelize,
    tableName: "professional",
    underscored: true,
    timestamps: true,
});
