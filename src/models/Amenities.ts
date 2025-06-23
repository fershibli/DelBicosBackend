import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";
import { ProfessionalModel } from "./Professional";

/*
CREATE TABLE amenities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    active BOOLEAN DEFAULT TRUE,
    createdAt DATETIME,
    updatedAt DATETIME
);
*/

export interface IAmenity {
  id?: number;
  title: string;
  description?: string;
  active?: boolean;
}

type AmenityCreationAttributes = Optional<IAmenity, "id" | "description" | "active">;

export class AmenitiesModel extends Model<IAmenity, AmenityCreationAttributes> {
  public id!: number;
  public title!: string;
  public description?: string;
  public active?: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

AmenitiesModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
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
    tableName: "amenities",
    timestamps: true,
  }
);

AmenitiesModel.belongsToMany(ProfessionalModel, {
  through: "professional_amenities",
  as: "professionals",
  foreignKey: "amenity_id",
});

