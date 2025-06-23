import { DataTypes, Model, Optional, Association, HasManyGetAssociationsMixin, BelongsToGetAssociationMixin } from "sequelize";
import { sequelize } from "../config/database";
import { UserModel } from "./User";
import { AddressModel } from "./Address";
import { ServiceModel } from "./Service";

export interface ProfessionalAttributes {
  id: number;
  user_id: number;
  main_address_id: number;
  cpf: string;
  cnpj: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProfessionalCreationAttributes extends Optional<ProfessionalAttributes, "id" | "main_address_id" | "cnpj"> {}

export class ProfessionalModel extends Model<ProfessionalAttributes, ProfessionalCreationAttributes> implements ProfessionalAttributes {
  public id!: number;
  public user_id!: number;
  public main_address_id!: number;
  public cpf!: string;
  public cnpj!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;


  public User?: UserModel;
  public Address?: AddressModel;
  public Services?: ServiceModel[];

  public getUser!: BelongsToGetAssociationMixin<UserModel>;
  public getAddress!: BelongsToGetAssociationMixin<AddressModel>;
  public getServices!: HasManyGetAssociationsMixin<ServiceModel>;

  public static associations: {
    User: Association<ProfessionalModel, UserModel>;
    Address: Association<ProfessionalModel, AddressModel>;
    Services: Association<ProfessionalModel, ServiceModel>;
  };
}

ProfessionalModel.init(
  {
      id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
      },
      user_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: { model: "users", key: "id" },
      },
      main_address_id: {
          type: DataTypes.INTEGER,
          allowNull: true,
          references: { model: "addresses", key: "id" },
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
      createdAt: "",
      updatedAt: ""
  },
  
  {
    sequelize,
    tableName: "professional",
    timestamps: true,
  }
);

ProfessionalModel.belongsTo(UserModel, { foreignKey: "user_id", as: "User" });
ProfessionalModel.belongsTo(AddressModel, { foreignKey: "main_address_id", as: "address" });
ProfessionalModel.hasMany(ServiceModel, { foreignKey: "professional_id", as: "services" });
