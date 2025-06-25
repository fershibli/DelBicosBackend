import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";
import { ProfessionalModel } from "./Professional";

/*
CREATE TABLE gallery (
    id INT AUTO_INCREMENT PRIMARY KEY,
    professional_id INT NOT NULL,
    url VARCHAR(255) NOT NULL,
    description TEXT,
    active BOOLEAN DEFAULT TRUE,
    createdAt DATETIME,
    updatedAt DATETIME,
    FOREIGN KEY (professional_id) REFERENCES professional(id)
);
*/

export interface IGallery {
  id?: number;
  professional_id: number;
  url: string;
  description?: string;
  active?: boolean;
}

type GalleryCreationAttributes = Optional<IGallery, "id" | "description" | "active">;

export class GalleryModel extends Model<IGallery, GalleryCreationAttributes> {
  public id!: number;
  public professional_id!: number;
  public url!: string;
  public description?: string;
  public active?: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

GalleryModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    professional_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "professional", key: "id" },
    },
    url: {
      type: DataTypes.STRING(255),
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
    tableName: "gallery",
    timestamps: true,
  }
);

