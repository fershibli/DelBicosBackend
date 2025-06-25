import {
  DataTypes,
  Model,
  Optional,
  Association,
  HasManyGetAssociationsMixin,
  BelongsToGetAssociationMixin,
  BelongsToManyGetAssociationsMixin,
} from "sequelize";
import { sequelize } from "../config/database";
import { UserModel } from "./User";
import { AddressModel } from "./Address";
import { ServiceModel } from "./Service";
import { AmenitiesModel } from "./Amenities";
import { GalleryModel } from "./Gallery";
import { ProfessionalAvailabilityModel } from "./ProfessionalAvailability";
import { models } from "mongoose";

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

export class ProfessionalModel extends Model<IProfessional, ProfessionalCreationalAttributes> {
  public id!: number;
  public user_id!: number;
  public main_address_id?: number;
  public cpf!: string;
  public cnpj?: string;
  public description?: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public User?: UserModel;
  public address?: AddressModel;
  public services?: ServiceModel[];
  public amenities?: AmenitiesModel[];
  public gallery?: GalleryModel[];
  public availabilities?: ProfessionalAvailabilityModel[];

  public getUser!: BelongsToGetAssociationMixin<UserModel>;
  public getAddress!: BelongsToGetAssociationMixin<AddressModel>;
  public getServices!: HasManyGetAssociationsMixin<ServiceModel>;
  public getAmenities!: BelongsToManyGetAssociationsMixin<AmenitiesModel>;
  public getGallery!: HasManyGetAssociationsMixin<GalleryModel>;

  public static associations: {
    User: Association<ProfessionalModel, UserModel>;
    address: Association<ProfessionalModel, AddressModel>;
    services: Association<ProfessionalModel, ServiceModel>;
    amenities: Association<ProfessionalModel, AmenitiesModel>;
    gallery: Association<ProfessionalModel, GalleryModel>;
    availabilities: Association<ProfessionalModel, ProfessionalAvailabilityModel>;
  };

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

    ProfessionalModel.hasMany(GalleryModel, {
      foreignKey: "professional_id",
      as: "gallery",
    });

    ProfessionalModel.belongsToMany(AmenitiesModel, {
      through: "professional_amenities",
      as: "amenities",
      foreignKey: "professional_id",
      otherKey: "amenity_id",
    });

    ProfessionalModel.hasMany(ProfessionalAvailabilityModel, {
      foreignKey: "professional_id",
      as: "availabilities",
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
    modelName: "Professional",
    freezeTableName: true,
  }
);

