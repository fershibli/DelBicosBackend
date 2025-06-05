import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

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
  professional_id: number;
  start_time: Date;
  end_time: Date;
}

type ProfessionalAvailabilityLockCreationalAttributes = Optional<
  IProfessionalAvailabilityLock,
  "professional_id" | "start_time" | "end_time"
>;

export class ProfessionalAvailabilityLockModel extends Model<
  IProfessionalAvailabilityLock,
  ProfessionalAvailabilityLockCreationalAttributes
> {
  public professional_id!: number;
  public start_time!: Date;
  public end_time!: Date;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ProfessionalAvailabilityLockModel.init(
  {
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
      primaryKey: true,
    },
    end_time: {
      type: DataTypes.DATE,
      allowNull: false,
      primaryKey: true,
    },
  },
  {
    sequelize,
    tableName: "professional_availability_lock",
    timestamps: true,
  }
);
