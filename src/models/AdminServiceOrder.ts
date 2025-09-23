import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";
import { AdminModel } from "./Admin";
import { AppointmentModel } from "./Appointment";

/*
CREATE TABLE admin_service_order (
    id INT AUTO_INCREMENT PRIMARY KEY,
    admin_id INT NOT NULL,
    appointment_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    description VARCHAR(1000) NOT NULL,
    status ENUM('pending', 'in_progress', 'completed', 'canceled') DEFAULT 'pending',
    FOREIGN KEY (admin_id) REFERENCES admin(id),
    FOREIGN KEY (appointment_id) REFERENCES appointment(id),
    INDEX idx_status_check (status, INDEX idx_appointment_check (appointment_id, status)
);
*/

export interface IAdminServiceOrder {
  id?: number;
  admin_id: number;
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
  public admin_id!: number;
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
    admin_id: {
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
    timestamps: false,
  }
);

AdminServiceOrderModel.belongsTo(AdminModel, {
  foreignKey: "admin_id",
  as: "Admin",
});

AdminServiceOrderModel.belongsTo(AppointmentModel, {
  foreignKey: "appointment_id",
  as: "Appointment",
});
