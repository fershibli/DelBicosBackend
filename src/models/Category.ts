import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";

/*
CREATE TABLE category (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    active BOOLEAN DEFAULT TRUE,
    INDEX active_index_category (active)
);
*/

export interface ICategory {
  id?: number;
  title: string;
  description?: string;
  active?: boolean;
}

type CategoryCreationalAttributes = Optional<ICategory, "id" | "active">;

export class CategoryModel extends Model<
  ICategory,
  CategoryCreationalAttributes
> {
  public id!: number;
  public title!: string;
  public description?: string;
  public active?: boolean;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

CategoryModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: "category",
    timestamps: true,
  }
);
