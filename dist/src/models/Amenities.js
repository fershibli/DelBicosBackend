"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AmenitiesModel = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
class AmenitiesModel extends sequelize_1.Model {
}
exports.AmenitiesModel = AmenitiesModel;
AmenitiesModel.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    title: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false,
    },
    description: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
    active: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: true,
    },
}, {
    sequelize: database_1.sequelize,
    tableName: "amenities",
    underscored: true,
    timestamps: true,
});
