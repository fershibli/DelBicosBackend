"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfessionalAmenityModel = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
class ProfessionalAmenityModel extends sequelize_1.Model {
}
exports.ProfessionalAmenityModel = ProfessionalAmenityModel;
ProfessionalAmenityModel.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    professional_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    amenity_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    sequelize: database_1.sequelize,
    tableName: "professional_amenities",
    underscored: true,
    timestamps: false,
});
