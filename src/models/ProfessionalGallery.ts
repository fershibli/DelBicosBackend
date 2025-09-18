import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";

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

export interface IProfessionalGallery {
  id?: number;
  professional_id: number;
  url: string;
  description?: string;
  active?: boolean;
}

type ProfessionalGalleryCreationAttributes = Optional<IProfessionalGallery, "id" | "description" | "active">;

export class ProfessionalGalleryModel extends Model<IProfessionalGallery, ProfessionalGalleryCreationAttributes> {
  public id!: number;
  public professional_id!: number;
  public url!: string;
  public description?: string;
  public active?: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ProfessionalGalleryModel.init(
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
    tableName: "professional_gallery",
    timestamps: true,
  }
);

