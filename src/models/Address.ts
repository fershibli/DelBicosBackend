import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

/*
CREATE TABLE address (
  id INT AUTO_INCREMENT PRIMARY KEY,
  lat DECIMAL(10,8) NOT NULL,
  lng DECIMAL(11,8) NOT NULL
  street VARCHAR(255) NOT NULL,
  number VARCHAR(10) NOT NULL,
  complement VARCHAR(255),
  neighborhood VARCHAR(100) NOT NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(2) NOT NULL,
  country_iso VARCHAR(2) NOT NULL,
  postal_code VARCHAR(8) NOT NULL,
  user_id INT NOT NULL,
  active BOOLEAN DEFAULT TRUE,
  FOREIGN KEY (user_id) REFERENCES users(id),
  INDEX active_index_address (active),
)

CREATE SPATIAL INDEX idx_location ON address(lat, lng);
*/

export interface IAddress {
  id?: number;
  lat: number;
  lng: number;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  country_iso: string;
  postal_code: string;
  user_id: number;
  active?: boolean;
}

type AddressCreationalAttributes = Optional<IAddress, "id" | "active">;

export class AddressModel extends Model<IAddress, AddressCreationalAttributes> {
  public id!: number;
  public lat!: number;
  public lng!: number;
  public street!: string;
  public number!: string;
  public complement?: string;
  public neighborhood!: string;
  public city!: string;
  public state!: string;
  public country_iso!: string;
  public postal_code!: string;
  public user_id!: number;
  public active?: boolean;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

AddressModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    lat: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: false,
    },
    lng: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: false,
    },
    street: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    number: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    complement: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    neighborhood: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING(2),
      allowNull: false,
    },
    country_iso: {
      type: DataTypes.STRING(2),
      allowNull: false,
    },
    postal_code: {
      type: DataTypes.STRING(8),
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize,
    modelName: "Address",
    tableName: "address",
    indexes: [
      {
        name: "active_index_address",
        fields: ["active"],
      },
      {
        name: "idx_location",
        fields: ["lat", "lng"],
        using: "SPATIAL",
      },
    ],
  }
);
