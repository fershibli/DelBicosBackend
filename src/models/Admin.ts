import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";
import { UserModel } from "./User";
import { AdminServiceOrderModel } from "./AdminServiceOrder";

/*
CREATE TABLE admin (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
)
*/

export interface IAdmin {
  id?: number;
  user_id: number;
}

type AdminCreationalAttributes = Optional<IAdmin, "id">;

export class AdminModel extends Model<IAdmin, AdminCreationalAttributes> {
  public id!: number;
  public user_id!: number;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

AdminModel.init(
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
        model: "users",
        key: "id",
      },
    },
  },
  {
    sequelize,
    tableName: "admin",
    timestamps: true,
  }
);

 // Admin relationships
  AdminModel.belongsTo(UserModel, { 
    foreignKey: "user_id", 
    as: "User" 
  });
  
  AdminModel.hasMany(AdminServiceOrderModel, { 
    foreignKey: "admin_id", 
    as: "ServiceOrders" 
  });