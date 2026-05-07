"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfessionalAvailabilityModel = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
class ProfessionalAvailabilityModel extends sequelize_1.Model {
}
exports.ProfessionalAvailabilityModel = ProfessionalAvailabilityModel;
ProfessionalAvailabilityModel.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    professional_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "professional",
            key: "id",
        },
    },
    days_of_week: {
        type: sequelize_1.DataTypes.STRING(7),
        defaultValue: "0000000", // Bitmask for days of the week
    },
    start_day_of_month: {
        type: sequelize_1.DataTypes.INTEGER,
        validate: {
            min: 1,
            max: 31,
        },
        defaultValue: null,
    },
    end_day_of_month: {
        type: sequelize_1.DataTypes.INTEGER,
        validate: {
            min: 1,
            max: 31,
        },
        defaultValue: null,
    },
    start_day: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: null,
    },
    end_day: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: null,
    },
    start_time: {
        type: sequelize_1.DataTypes.TIME,
        allowNull: false,
    },
    end_time: {
        type: sequelize_1.DataTypes.TIME,
        allowNull: false,
    },
    is_available: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: true,
    },
    recurrence_pattern: {
        type: sequelize_1.DataTypes.ENUM("none", "daily", "weekly", "monthly"),
        defaultValue: "none",
    },
}, {
    sequelize: database_1.sequelize,
    tableName: "professional_availability",
    underscored: true,
    indexes: [
        {
            name: "idx_prof_availability_recurrence",
            fields: [
                "professional_id",
                "recurrence_pattern",
                "start_day",
                "end_day",
            ],
        },
    ],
    timestamps: true,
});
