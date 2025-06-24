import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";
import { UserModel } from "./User";
import { AddressModel } from "./Address";
import { ServiceModel } from "./Service";

export interface IProfessional {
  id?: number;
  user_id: number;
  main_address_id?: number;
  cpf: string;
  cnpj?: string;
  description?: string;
}

type ProfessionalCreationalAttributes = Optional<
  IProfessional,
  "id" | "main_address_id" | "cnpj" | "description"
>;

export class ProfessionalModel extends Model<
  IProfessional,
  ProfessionalCreationalAttributes
> {
  public id!: number;
  public user_id!: number;
  public main_address_id?: number;
  public cpf!: string;
  public cnpj?: string;
  public description?: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static associate() {
    ProfessionalModel.belongsTo(UserModel, {
      foreignKey: "user_id",
      as: "User",
    });

    ProfessionalModel.belongsTo(AddressModel, {
      foreignKey: "main_address_id",
      as: "address",
    });

    ProfessionalModel.hasMany(ServiceModel, {
      foreignKey: "professional_id",
      as: "services",
    });
  }
}

ProfessionalModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    main_address_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    cpf: {
      type: DataTypes.STRING(14),
      allowNull: false,
      unique: true,
    },
    cnpj: {
      type: DataTypes.STRING(18),
      allowNull: true,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "professional",
    timestamps: true,
  }
);

ProfessionalModel.hasMany(ProfessionalModel, {
    foreignKey: 'professional_id',
    as: 'availabilities'
  });