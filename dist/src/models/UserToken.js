"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserTokenModel = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
class UserTokenModel extends sequelize_1.Model {
}
exports.UserTokenModel = UserTokenModel;
UserTokenModel.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    user_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        references: {
            model: "users",
            key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
    },
    token: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
    },
}, {
    tableName: "user_tokens",
    sequelize: database_1.sequelize,
    underscored: true,
    timestamps: true,
});
