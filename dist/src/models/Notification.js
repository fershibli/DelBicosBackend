"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationModel = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
class NotificationModel extends sequelize_1.Model {
}
exports.NotificationModel = NotificationModel;
NotificationModel.init({
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
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
    },
    title: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false,
    },
    message: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
    is_read: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    notification_type: {
        type: sequelize_1.DataTypes.ENUM("appointment", "service", "system", "general"),
        defaultValue: "system",
        allowNull: true,
    },
    related_entity_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
    },
}, {
    sequelize: database_1.sequelize,
    tableName: "notifications",
    modelName: "Notification",
    timestamps: true,
    underscored: true,
});
