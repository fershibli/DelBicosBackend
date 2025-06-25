import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";
import { ProfessionalModel } from "./Professional";

/*
CREATE TABLE service (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    duration INT NOT NULL,
    bannerImg VARCHAR(255),
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
  duration: number;
  bannerImg?: string;
  active?: boolean;
  subcategory_id: number;
  professional_id: number;
}

type ServiceCreationalAttributes = Optional<
  IService,
  "id" | "description" | "bannerImg" | "active"
>;

export class ServiceModel extends Model<IService, ServiceCreationalAttributes> {
  public id!: number;
  public title!: string;
  public description?: string;
  public price!: number;
  public duration!: number;
  public bannerImg?: string;
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
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "Duration in minutes",
    },
    bannerImg: {
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
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        name: "active_index_service",
        fields: ["active"],
      },
      {
        name: "professional_service_index",
        fields: ["professional_id"],
      },
    ],
  }
);
