import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";

export interface IServiceAvailability {
  id?: number;
  service_id: number;
  /** 0 = Domingo, 1 = Segunda, ..., 6 = Sábado */
  day_of_week: number;
  /** Formato HH:MM ou HH:MM:SS */
  start_time: string;
  /** Formato HH:MM ou HH:MM:SS */
  end_time: string;
}

type ServiceAvailabilityCreationalAttributes = Optional<
  IServiceAvailability,
  "id"
>;

export class ServiceAvailabilityModel extends Model<
  IServiceAvailability,
  ServiceAvailabilityCreationalAttributes
> {
  public id!: number;
  public service_id!: number;
  public day_of_week!: number;
  public start_time!: string;
  public end_time!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ServiceAvailabilityModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    service_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "service",
        key: "id",
      },
    },
    day_of_week: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      comment: "0=Domingo, 1=Segunda, ..., 6=Sábado",
    },
    start_time: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    end_time: {
      type: DataTypes.TIME,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "service_availability",
    underscored: true,
    timestamps: true,
    indexes: [
      { name: "idx_service_availability_service", fields: ["service_id"] },
      {
        name: "idx_service_availability_service_day",
        fields: ["service_id", "day_of_week"],
      },
    ],
  },
);
