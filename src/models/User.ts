import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";

/*
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(13) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    avatarImg VARCHAR(255),
    bannerImg VARCHAR(255),
    INDEX active_index_users (active)
);
*/

export interface IUser {
  id?: number;
  name: string;
  email: string;
  phone: string;
  password: string;
  active?: boolean;
  avatarImg?: string;
  bannerImg?: string;
}

type UserCreationalAttributes = Optional<IUser, "id" | "active" | "avatarImg" | "bannerImg">;

export class UserModel extends Model<IUser, UserCreationalAttributes> {
  public id!: number;
  public name!: string;
  public email!: string;
  public phone!: string;
  public password!: string;
  public active?: boolean;
  public avatarImg?: string;
  public bannerImg?: string;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

UserModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    phone: {
      type: DataTypes.STRING(13),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    avatarImg: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    bannerImg: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "User",
    tableName: "users",
    indexes: [
      {
        name: "active_index_users",
        fields: ["active"],
      },
    ],
  }
);
