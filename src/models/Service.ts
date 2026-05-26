import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";

/*
CREATE TABLE service (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    duration INT NOT NULL,
    banner_uri VARCHAR(255),
    active BOOLEAN DEFAULT TRUE,
    subcategory_id INT NOT NULL,
    professional_id INT NOT NULL,
    FOREIGN KEY (subcategory_id) REFERENCES subcategory(id),
    FOREIGN KEY (professional_id) REFERENCES professional(id),
    INDEX active_index_service (active)
);
*/

export interface IService {
  id?: number;
  title: string;
  description?: string;
  price: number;
  price_cents?: number;
  duration: number;
  date?: Date;
  banner_uri?: string;
  active?: boolean;
  subcategory_id: number;
  professional_id: number;
}

type ServiceCreationalAttributes = Optional<
  IService,
  "id" | "description" | "price_cents" | "date" | "banner_uri" | "active"
>;

export class ServiceModel extends Model<IService, ServiceCreationalAttributes> {
  public id!: number;
  public title!: string;
  public description?: string;
  public price!: number;
  public price_cents?: number;
  public duration!: number;
  public date?: Date;
  public banner_uri?: string;
  public active?: boolean;
  public subcategory_id!: number;
  public professional_id!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ServiceModel.init(
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
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    price_cents: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "Preço em centavos (inteiro). Tem precedência sobre price.",
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "Duration in minutes",
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      comment: "Data de disponibilidade ou vigência do serviço",
    },
    banner_uri: {
      type: DataTypes.STRING(255),
      allowNull: true,
      validate: {
        isUrl: {
          msg: "Banner image must be a valid URL",
        },
      },
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    subcategory_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "subcategory",
        key: "id",
      },
    },
    professional_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "professional",
        key: "id",
      },
    },
  },
  {
    sequelize,
    tableName: "service",
    underscored: true,
    timestamps: true,
    indexes: [
      {
        name: "idx_service_active",
        fields: ["active"],
      },
      {
        name: "idx_service_professional",
        fields: ["professional_id"],
      },
    ],
  },
);
