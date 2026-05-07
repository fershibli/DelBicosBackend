"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentModel = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
class AppointmentModel extends sequelize_1.Model {
}
exports.AppointmentModel = AppointmentModel;
AppointmentModel.init({
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
    client_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "client",
            key: "id",
        },
    },
    service_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "service",
            key: "id",
        },
    },
    address_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "address",
            key: "id",
        },
    },
    rating: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        validate: { min: 1, max: 5 },
    },
    review: {
        type: sequelize_1.DataTypes.STRING(1000),
        allowNull: true,
    },
    completed_at: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
    },
    final_price: {
        type: sequelize_1.DataTypes.DECIMAL(10, 2),
        allowNull: true,
    },
    start_time: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
    },
    end_time: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
    },
    status: {
        type: sequelize_1.DataTypes.ENUM("pending", "confirmed", "completed", "canceled"),
        defaultValue: "pending",
    },
    payment_intent_id: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
        unique: true,
    },
}, {
    sequelize: database_1.sequelize,
    tableName: "appointment",
    underscored: true,
    indexes: [
        {
            name: "idx_appointment_times",
            fields: ["professional_id", "start_time", "end_time"],
        },
        {
            name: "idx_status_check",
            fields: ["status", "start_time"],
        },
        {
            name: "idx_prof_status_completed_at",
            fields: ["professional_id", "status", "completed_at"],
        },
    ],
    timestamps: true,
});
