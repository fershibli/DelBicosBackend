import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";

export interface IProfessionalAmenity {
  id?: number;
  professional_id: number;
  amenity_id: number;
}

type CreationAttrs = Optional<IProfessionalAmenity, "id">;

export class ProfessionalAmenityModel extends Model<IProfessionalAmenity, CreationAttrs> {
  public id!: number;
  public professional_id!: number;
  public amenity_id!: number;
}

ProfessionalAmenityModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    professional_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    amenity_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "professional_amenities",
    timestamps: false,
  }
);
