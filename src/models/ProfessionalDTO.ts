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
import { ProfessionalAmenityModel } from "./ProfessionalAmenities";
import { ProfessionalAvailabilityModel } from "./ProfessionalAvailability";

export interface ProfessionalAttributes {
  id: number;
  user_id: number;
  main_address_id: number;
  cpf: string;
  cnpj: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProfessionalCreationAttributes
  extends Optional<ProfessionalAttributes, "id" | "main_address_id" | "cnpj" | "description" > {}

export class ProfessionalModel extends Model<
  ProfessionalAttributes,
  ProfessionalCreationAttributes
> implements ProfessionalAttributes {
  public id!: number;
  public user_id!: number;
  public main_address_id!: number;
  public cpf!: string;
  public cnpj!: string;
  public description?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public User?: UserModel;
  public Address?: AddressModel;
  public Services?: ServiceModel[];
  public Amenities?: AmenitiesModel[];
  public Gallery?: GalleryModel[];

  public getUser!: BelongsToGetAssociationMixin<UserModel>;
  public getAddress!: BelongsToGetAssociationMixin<AddressModel>;
  public getServices!: HasManyGetAssociationsMixin<ServiceModel>;
  public getAmenities!: BelongsToManyGetAssociationsMixin<AmenitiesModel>;
  public getGallery!: HasManyGetAssociationsMixin<GalleryModel>;

  public static associations: {
    User: Association<ProfessionalModel, UserModel>;
    Address: Association<ProfessionalModel, AddressModel>;
    Services: Association<ProfessionalModel, ServiceModel>;
    Amenities: Association<ProfessionalModel, AmenitiesModel>;
    Gallery: Association<ProfessionalModel, GalleryModel>;
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
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    createdAt: "",
    updatedAt: "",
  },
  {
    sequelize,
    tableName: "professional",
    timestamps: true,
  }
);

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
    foreignKey: 'professional_id',
    as: 'availabilities'
  });