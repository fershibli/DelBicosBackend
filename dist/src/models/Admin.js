"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminModel = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
class AdminModel extends sequelize_1.Model {
}
exports.AdminModel = AdminModel;
AdminModel.init({
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
}, {
    sequelize: database_1.sequelize,
    tableName: "admin",
    underscored: true,
    timestamps: true,
});
