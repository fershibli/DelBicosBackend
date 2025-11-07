import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import { sequelize } from "../config/database";

interface UserTokenAttributes {
  id: number;
  user_id: number;
  token: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface UserTokenCreationAttributes
  extends Optional<UserTokenAttributes, "id" | "createdAt" | "updatedAt"> {}

export class UserTokenModel
  extends Model<UserTokenAttributes, UserTokenCreationAttributes>
  implements UserTokenAttributes
{
  public id!: number;
  public user_id!: number;
  public token!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

UserTokenModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: {
        model: "users",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    token: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  {
    tableName: "user_tokens",
    sequelize,
    underscored: true,
    timestamps: true,
  }
);
