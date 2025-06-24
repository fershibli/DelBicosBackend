import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";
import { ProfessionalModel } from "./Professional";

/*
CREATE TABLE professional_availability (
    id INT AUTO_INCREMENT PRIMARY KEY,
    professional_id INT NOT NULL,
    days_of_week VARCHAR(7) DEFAULT '0000000', -- Bitmask (Dom=primeiro, Sáb=último). Ex: Seg-Sex = '0111110'
    start_day_of_month INT CHECK (start_day_of_month BETWEEN 1 AND 31) DEFAULT NULL, -- Dia do mês inicial (opcional)
    end_day_of_month INT CHECK (start_day_of_month BETWEEN 1 AND 31) DEFAULT NULL, -- Dia do mês final (opcional)
    CHECK (start_day_of_month <= end_day_of_month),
    start_day DATE, -- Data inicial da disponibilidade (opcional)
    end_day DATE, -- Data final (opcional)
    start_time TIME NOT NULL, -- Horário de início (ex: 09:00:00)
    end_time TIME NOT NULL -- Horário de término (ex: 18:00:00)
    is_available BOOLEAN DEFAULT TRUE,
    recurrence_pattern ENUM('none', 'daily', 'weekly', 'monthly') DEFAULT 'none',
    FOREIGN KEY (professional_id) REFERENCES professional(id),
    INDEX idx_recurrence_combo (professional_id, recurrence_pattern, start_day, end_day)
);
*/

export interface IProfessionalAvailability {
  id?: number;
  professional_id: number;
  days_of_week?: string;
  start_day_of_month?: number;
  end_day_of_month?: number;
  start_day?: Date;
  end_day?: Date;
  start_time: string;
  end_time: string;
  is_available?: boolean;
  recurrence_pattern?: "none" | "daily" | "weekly" | "monthly";
}

type ProfessionalAvailabilityCreationalAttributes = Optional<
  IProfessionalAvailability,
  | "id"
  | "days_of_week"
  | "start_day_of_month"
  | "end_day_of_month"
  | "start_day"
  | "end_day"
  | "is_available"
  | "recurrence_pattern"
>;

export class ProfessionalAvailabilityModel extends Model<
  IProfessionalAvailability,
  ProfessionalAvailabilityCreationalAttributes
> {
  public id!: number;
  public professional_id!: number;
  public days_of_week?: string;
  public start_day_of_month?: number;
  public end_day_of_month?: number;
  public start_day?: Date;
  public end_day?: Date;
  public start_time!: string;
  public end_time!: string;
  public is_available?: boolean;
  public recurrence_pattern?: "none" | "daily" | "weekly" | "monthly";

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ProfessionalAvailabilityModel.init(
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
    days_of_week: {
      type: DataTypes.STRING(7),
      defaultValue: "0000000", // Bitmask for days of the week
    },
    start_day_of_month: {
      type: DataTypes.INTEGER,
      validate: {
        min: 1,
        max: 31,
      },
      defaultValue: null,
    },
    end_day_of_month: {
      type: DataTypes.INTEGER,
      validate: {
        min: 1,
        max: 31,
      },
      defaultValue: null,
    },
    start_day: {
      type: DataTypes.DATE,
      defaultValue: null,
    },
    end_day: {
      type: DataTypes.DATE,
      defaultValue: null,
    },
    start_time: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    end_time: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    is_available: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    recurrence_pattern: {
      type: DataTypes.ENUM("none", "daily", "weekly", "monthly"),
      defaultValue: "none",
    },
  },
  {
    sequelize,
    tableName: "professional_availability",
    indexes: [
      {
        name: "idx_recurrence_combo",
        fields: [
          "professional_id",
          "recurrence_pattern",
          "start_day",
          "end_day",
        ],
      },
    ],
    timestamps: true,
  }
);

  ProfessionalAvailabilityModel.belongsTo(ProfessionalModel, {
    foreignKey: 'professional_id',
    as: 'professional'
  });