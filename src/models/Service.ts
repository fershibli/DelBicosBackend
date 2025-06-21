import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";

/*
CREATE TABLE service (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    duration INT NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    subcategory_id INT NOT NULL,
    FOREIGN KEY (subcategory_id) REFERENCES subcategory(id),
    INDEX active_index_service (active)
);
*/

export interface IService {
  id?: number;
  title: string;
  description?: string;
  price: number;
  duration: number;
  active?: boolean;
  subcategory_id: number;
}

type ServiceCreationalAttributes = Optional<
  IService,
  "id" | "description" | "active"
>;

export class ServiceModel extends Model<IService, ServiceCreationalAttributes> {
  public id!: number;
  public title!: string;
  public description?: string;
  public price!: number;
  public duration!: number;
  public active?: boolean;
  public subcategory_id!: number;

  // Timestamps
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
  },
  {
    sequelize,
    tableName: "service",
    timestamps: true,
    indexes: [
      {
        name: "active_index_service",
        fields: ["active"],
      },
    ],
  }
);
