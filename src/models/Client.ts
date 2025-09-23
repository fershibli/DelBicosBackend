import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";
import { UserModel } from "./User";
import { AddressModel } from "./Address";
import { AppointmentModel } from "./Appointment";

/*
CREATE TABLE client (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    main_address_id INT,
    cpf VARCHAR(14) UNIQUE NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (main_address_id) REFERENCES address(id),
)
*/

export interface IClient {
  id?: number;
  user_id: number;
  main_address_id?: number;
  cpf: string;
}

type ClientCreationalAttributes = Optional<IClient, "id" | "main_address_id">;

export class ClientModel extends Model<IClient, ClientCreationalAttributes> {
  public id!: number;
  public user_id!: number;
  public main_address_id?: number;
  public cpf!: string;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ClientModel.init(
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
    main_address_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "address",
        key: "id",
      },
    },
    cpf: {
      type: DataTypes.STRING(14),
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
    tableName: "client",
    modelName: "Client",
    timestamps: true,
  }
);

ClientModel.belongsTo(UserModel, {
  foreignKey: "user_id",
  as: "User",
});

ClientModel.belongsTo(AddressModel, {
  foreignKey: "main_address_id",
  as: "MainAddress",
});

ClientModel.hasMany(AppointmentModel, {
  foreignKey: "client_id",
  as: "Appointments",
});
