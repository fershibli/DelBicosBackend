"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceModel = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
class ServiceModel extends sequelize_1.Model {
}
exports.ServiceModel = ServiceModel;
ServiceModel.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    title: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false,
    },
    description: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
    price: {
        type: sequelize_1.DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    duration: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        comment: "Duration in minutes",
    },
    banner_uri: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: true,
        validate: {
            isUrl: {
                msg: "Banner image must be a valid URL",
            },
        },
    },
    active: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: true,
    },
    subcategory_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "subcategory",
            key: "id",
        },
    },
    professional_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "professional",
            key: "id",
        },
    },
}, {
    sequelize: database_1.sequelize,
    tableName: "service",
    underscored: true,
    timestamps: true,
    indexes: [
        {
            name: "idx_service_active",
            fields: ["active"],
        },
        {
            name: "idx_service_professional",
            fields: ["professional_id"],
        },
    ],
});
