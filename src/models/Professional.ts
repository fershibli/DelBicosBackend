import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";
import { UserModel } from "./User";
import { AddressModel } from "./Address";
import { ServiceModel } from "./Service";
import { AmenitiesModel } from "./Amenities";
import { ProfessionalGalleryModel } from "./ProfessionalGallery";
import { ProfessionalAvailabilityModel } from "./ProfessionalAvailability";
import { AppointmentModel } from "./Appointment";
import { ProfessionalAvailabilityLockModel } from "./ProfessionalAvailabilityLock";

/*
CREATE TABLE professional (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    main_address_id INT,
    cpf VARCHAR(14) UNIQUE NOT NULL,
    cnpj VARCHAR(18) UNIQUE,
    description STRING(1500),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (main_address_id) REFERENCES address(id),
)
*/

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

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
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
      references: {
        model: "users",
        key: "id",
      },
    },
    main_address_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "address",
        key: "id",
      },
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
      type: DataTypes.STRING(1500),
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "professional",
    timestamps: true,
  }
);

ProfessionalModel.belongsTo(UserModel, { foreignKey: "user_id", as: "user" });
ProfessionalModel.belongsTo(AddressModel, {
  foreignKey: "main_address_id",
  as: "main_address",
});
ProfessionalModel.hasMany(AddressModel, {
  foreignKey: "professional_id",
  as: "addresses",
});
ProfessionalModel.hasMany(ServiceModel, {
  foreignKey: "professional_id",
  as: "services",
});
ProfessionalModel.belongsToMany(AmenitiesModel, {
  through: "professional_amenities",
  foreignKey: "professional_id",
  otherKey: "amenity_id",
  as: "amenities",
});
ProfessionalModel.hasMany(ProfessionalGalleryModel, {
  foreignKey: "professional_id",
  as: "gallery",
});
ProfessionalModel.hasMany(ProfessionalAvailabilityModel, {
  foreignKey: "professional_id",
  as: "availabilities",
});
ProfessionalModel.hasMany(ProfessionalAvailabilityLockModel, {
  foreignKey: "professional_id",
  as: "availability_locks",
});
ProfessionalModel.hasMany(AppointmentModel, {
  foreignKey: "professional_id",
  as: "appointments",
});
