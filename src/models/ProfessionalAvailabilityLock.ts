import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";

/*
CREATE TABLE professional_availability_lock (
    professional_id INT NOT NULL,
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    PRIMARY KEY (professional_id, start_time, end_time),
    FOREIGN KEY (professional_id) REFERENCES professional(id)
);
*/

export interface IProfessionalAvailabilityLock {
  id?: number;
  professional_id: number;
  start_time: Date;
  end_time: Date;
  reason?: string;
  created_by?: number;
}

type ProfessionalAvailabilityLockCreationalAttributes = Optional<
  IProfessionalAvailabilityLock,
  "id" | "professional_id" | "start_time" | "end_time"
>;

export class ProfessionalAvailabilityLockModel extends Model<
  IProfessionalAvailabilityLock,
  ProfessionalAvailabilityLockCreationalAttributes
> {
  public id!: number;
  public professional_id!: number;
  public start_time!: Date;
  public end_time!: Date;
  public reason?: string;
  public created_by?: number;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ProfessionalAvailabilityLockModel.init(
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
      primaryKey: true,
      references: {
        model: "professional",
        key: "id",
      },
    },
    start_time: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    end_time: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    reason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: "users", key: "id" },
    },
  },
  {
    sequelize,
    tableName: "professional_availability_lock",
    underscored: true,
    timestamps: true,
  },
);
