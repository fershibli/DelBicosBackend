import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";

/*
CREATE TABLE appointment (
    id INT AUTO_INCREMENT PRIMARY KEY,
    professional_id INT NOT NULL,
    client_id INT NOT NULL,
    service_id INT NOT NULL,
    address_id INT NOT NULL,
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    status ENUM('pending', 'confirmed', 'completed', 'canceled') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (professional_id) REFERENCES professional(id),
    FOREIGN KEY (client_id) REFERENCES client(id),
    FOREIGN KEY (service_id) REFERENCES service(id),
    FOREIGN KEY (address_id) REFERENCES address(id),
    INDEX idx_appointment_times (professional_id, start_time, end_time),
    INDEX idx_status_check (status, start_time)
) 
*/

export interface IAppointment {
  id?: number;
  professional_id: number;
  client_id: number;
  service_id: number;
  address_id: number;
  start_time: Date;
  end_time: Date;
  status?: "pending" | "confirmed" | "completed" | "canceled";
}

type AppointmentCreationalAttributes = Optional<IAppointment, "id" | "status">;

export class AppointmentModel extends Model<
  IAppointment,
  AppointmentCreationalAttributes
> {
  public id!: number;
  public professional_id!: number;
  public client_id!: number;
  public service_id!: number;
  public address_id!: number;
  public start_time!: Date;
  public end_time!: Date;
  public status!: "pending" | "confirmed" | "completed" | "canceled";
  public created_at!: Date;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

AppointmentModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    professional_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "professional",
        key: "id",
      },
    },
    client_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "client",
        key: "id",
      },
    },
    service_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "service",
        key: "id",
      },
    },
    address_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "address",
        key: "id",
      },
    },
    start_time: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    end_time: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("pending", "confirmed", "completed", "canceled"),
      defaultValue: "pending",
    },
  },
  {
    sequelize,
    tableName: "appointment",
    indexes: [
      {
        name: "idx_appointment_times",
        fields: ["professional_id", "start_time", "end_time"],
      },
      {
        name: "idx_status_check",
        fields: ["status", "start_time"],
      },
    ],
    timestamps: true, // This will automatically add createdAt and updatedAt fields
  }
);
