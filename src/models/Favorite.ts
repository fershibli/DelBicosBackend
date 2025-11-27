import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";

export interface IFavorite {
  id?: number;
  user_id: number;
  professional_id: number;
  createdAt?: Date;
  updatedAt?: Date;
}

type FavoriteCreationalAttributes = Optional<
  IFavorite,
  "id" | "createdAt" | "updatedAt"
>;

export class FavoriteModel extends Model<
  IFavorite,
  FavoriteCreationalAttributes
> {
  public id!: number;
  public user_id!: number;
  public professional_id!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

FavoriteModel.init(
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
    professional_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "professional",
        key: "id",
      },
    },
  },
  {
    sequelize,
    tableName: "favorites",
    timestamps: true,
    underscored: true,
  }
);
