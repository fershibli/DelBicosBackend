"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddressModel = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
class AddressModel extends sequelize_1.Model {
}
exports.AddressModel = AddressModel;
AddressModel.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    lat: {
        type: sequelize_1.DataTypes.DECIMAL(10, 8),
        allowNull: false,
    },
    lng: {
        type: sequelize_1.DataTypes.DECIMAL(11, 8),
        allowNull: false,
    },
    street: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
    },
    number: {
        type: sequelize_1.DataTypes.STRING(10),
        allowNull: false,
    },
    complement: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: true,
    },
    neighborhood: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false,
    },
    city: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false,
    },
    state: {
        type: sequelize_1.DataTypes.STRING(2),
        allowNull: false,
    },
    country_iso: {
        type: sequelize_1.DataTypes.STRING(2),
        allowNull: false,
    },
    postal_code: {
        type: sequelize_1.DataTypes.STRING(8),
        allowNull: false,
    },
    user_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    active: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: true,
    },
}, {
    sequelize: database_1.sequelize,
    modelName: "Address",
    tableName: "address",
    underscored: true,
    timestamps: true,
    indexes: [
        {
            name: "idx_address_active",
            fields: ["active"],
        },
        {
            name: "idx_address_location",
            fields: ["lat", "lng"],
        },
    ],
});
