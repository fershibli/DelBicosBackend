import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";

export interface IDayOverride {
  id?: number;
  professional_id: number;
  date: string;
  start_time?: string | null;
  end_time?: string | null;
}

type DayOverrideCreationAttributes = Optional<IDayOverride, "id">;

export class DayOverrideModel extends Model<IDayOverride, DayOverrideCreationAttributes> {
  public id!: number;
  public professional_id!: number;
  public date!: string;
  public start_time?: string | null;
  public end_time?: string | null;
}

DayOverrideModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    professional_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "professional",
        key: "id",
      },
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    start_time: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    end_time: {
      type: DataTypes.TIME,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "professional_day_overrides",
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ["professional_id", "date"],
        name: "unique_day_override",
      },
    ],
    timestamps: true,
  }
);