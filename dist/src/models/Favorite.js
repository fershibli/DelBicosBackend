"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FavoriteModel = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
class FavoriteModel extends sequelize_1.Model {
}
exports.FavoriteModel = FavoriteModel;
FavoriteModel.init({
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
    tableName: "favorites",
    timestamps: true,
    underscored: true,
});
