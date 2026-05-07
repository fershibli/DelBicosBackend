"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfessionalAvailabilityLockModel = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
class ProfessionalAvailabilityLockModel extends sequelize_1.Model {
}
exports.ProfessionalAvailabilityLockModel = ProfessionalAvailabilityLockModel;
ProfessionalAvailabilityLockModel.init({
    professional_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
            model: "professional",
            key: "id",
        },
    },
    start_time: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        primaryKey: true,
    },
    end_time: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        primaryKey: true,
    },
}, {
    sequelize: database_1.sequelize,
    tableName: "professional_availability_lock",
    underscored: true,
    timestamps: true,
});
