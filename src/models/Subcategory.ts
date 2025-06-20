import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";
import { CategoryModel } from "./Category";

/*
CREATE TABLE subcategory (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    active BOOLEAN DEFAULT TRUE,
    category_id INT NOT NULL,
    FOREIGN KEY (category_id) REFERENCES category(id),
    INDEX active_index_subcategory (active)
);
*/

export interface ISubCategory {
  id?: number;
  title: string;
  description?: string;
  category_id: number;
  active?: boolean;
}

type SubCategoryCreationalAttributes = Optional<ISubCategory, "id" | "active">;

export class SubCategoryModel extends Model<
  ISubCategory,
  SubCategoryCreationalAttributes
> {
  public id!: number;
  public title!: string;
  public description?: string;
  public category_id!: number;
  public active?: boolean;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

SubCategoryModel.init(
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
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: CategoryModel,
        key: "id",
      },
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: "subcategory",
    timestamps: true,
  }
);
