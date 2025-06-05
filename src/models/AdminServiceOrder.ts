import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

/*
CREATE TABLE admin_service_order (
    id INT AUTO_INCREMENT PRIMARY KEY,
    appointment_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    description VARCHAR(1000) NOT NULL,
    status ENUM('pending', 'in_progress', 'completed', 'canceled') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (appointment_id) REFERENCES appointment(id),
    INDEX idx_status_check (status, created_at),
    INDEX idx_appointment_check (appointment_id, status)
)
*/

export interface IAdminServiceOrder {
  id?: number;
  user_id: number;
  appointment_id: number;
  title: string;
  description: string;
  status?: "pending" | "in_progress" | "completed" | "canceled";
  created_at?: Date;
  updated_at?: Date;
}

type AdminServiceOrderCreationalAttributes = Optional<
  IAdminServiceOrder,
  "id" | "status" | "created_at" | "updated_at"
>;

export class AdminServiceOrderModel extends Model<
  IAdminServiceOrder,
  AdminServiceOrderCreationalAttributes
> {
  public id!: number;
  public user_id!: number;
  public appointment_id!: number;
  public title!: string;
  public description!: string;
  public status!: "pending" | "in_progress" | "completed" | "canceled";
  public created_at!: Date;
  public updated_at!: Date;
}

AdminServiceOrderModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "admin",
        key: "id",
      },
    },
    appointment_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "appointment",
        key: "id",
      },
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(1000),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("pending", "in_progress", "completed", "canceled"),
      defaultValue: "pending",
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "admin_service_order",
    underscored: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    indexes: [
      {
        name: "idx_status_check",
        fields: ["status", "created_at"],
      },
      {
        name: "idx_appointment_check",
        fields: ["appointment_id", "status"],
      },
    ],
    timestamps: false,
  }
);
