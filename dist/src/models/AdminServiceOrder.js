"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminServiceOrderModel = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
class AdminServiceOrderModel extends sequelize_1.Model {
}
exports.AdminServiceOrderModel = AdminServiceOrderModel;
AdminServiceOrderModel.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    admin_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "admin",
            key: "id",
        },
    },
    appointment_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "appointment",
            key: "id",
        },
    },
    title: {
        type: sequelize_1.DataTypes.STRING(200),
        allowNull: false,
    },
    description: {
        type: sequelize_1.DataTypes.STRING(1000),
        allowNull: false,
    },
    status: {
        type: sequelize_1.DataTypes.ENUM("pending", "in_progress", "completed", "canceled"),
        defaultValue: "pending",
    },
}, {
    sequelize: database_1.sequelize,
    tableName: "admin_service_order",
    underscored: true,
    timestamps: true,
});
