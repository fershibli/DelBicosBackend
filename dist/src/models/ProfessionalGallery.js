"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfessionalGalleryModel = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
class ProfessionalGalleryModel extends sequelize_1.Model {
}
exports.ProfessionalGalleryModel = ProfessionalGalleryModel;
ProfessionalGalleryModel.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    professional_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: { model: "professional", key: "id" },
    },
    url: {
        type: sequelize_1.DataTypes.STRING(255),
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
    tableName: "professional_gallery",
    underscored: true,
    timestamps: true,
});
