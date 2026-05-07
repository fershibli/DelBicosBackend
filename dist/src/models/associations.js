"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeAssociations = initializeAssociations;
const User_1 = require("./User");
const Client_1 = require("./Client");
const Professional_1 = require("./Professional");
const Admin_1 = require("./Admin");
const Address_1 = require("./Address");
const Category_1 = require("./Category");
const Subcategory_1 = require("./Subcategory");
const Service_1 = require("./Service");
const Amenities_1 = require("./Amenities");
const ProfessionalAmenities_1 = require("./ProfessionalAmenities");
const ProfessionalGallery_1 = require("./ProfessionalGallery");
const ProfessionalAvailability_1 = require("./ProfessionalAvailability");
const ProfessionalAvailabilityLock_1 = require("./ProfessionalAvailabilityLock");
const Appointment_1 = require("./Appointment");
const AdminServiceOrder_1 = require("./AdminServiceOrder");
const UserToken_1 = require("./UserToken");
const Favorite_1 = require("./Favorite");
function initializeAssociations() {
    // User associations
    User_1.UserModel.hasOne(Client_1.ClientModel, {
        foreignKey: "user_id",
        as: "Client",
    });
    User_1.UserModel.hasOne(Professional_1.ProfessionalModel, {
        foreignKey: "user_id",
        as: "Professional",
    });
    User_1.UserModel.hasOne(Admin_1.AdminModel, {
        foreignKey: "user_id",
        as: "Admin",
    });
    User_1.UserModel.hasMany(Address_1.AddressModel, {
        foreignKey: "user_id",
        as: "Addresses",
    });
    User_1.UserModel.hasOne(UserToken_1.UserTokenModel, {
        foreignKey: "user_id",
        as: "UserToken",
    });
    UserToken_1.UserTokenModel.belongsTo(User_1.UserModel, {
        foreignKey: "user_id",
        as: "User",
    });
    User_1.UserModel.hasMany(Favorite_1.FavoriteModel, {
        foreignKey: "user_id",
        as: "Favorites",
    });
    // Address associations
    Address_1.AddressModel.belongsTo(User_1.UserModel, {
        foreignKey: "user_id",
        as: "User",
    });
    Address_1.AddressModel.hasOne(Client_1.ClientModel, {
        foreignKey: "main_address_id",
        as: "ClientsUsingAsMain",
    });
    Address_1.AddressModel.hasOne(Professional_1.ProfessionalModel, {
        foreignKey: "main_address_id",
        as: "ProfessionalsUsingAsMain",
    });
    Address_1.AddressModel.hasMany(Appointment_1.AppointmentModel, {
        foreignKey: "address_id",
        as: "Appointments",
    });
    // Client associations
    Client_1.ClientModel.belongsTo(User_1.UserModel, {
        foreignKey: "user_id",
        as: "User",
    });
    Client_1.ClientModel.belongsTo(Address_1.AddressModel, {
        foreignKey: "main_address_id",
        as: "MainAddress",
    });
    Client_1.ClientModel.hasMany(Appointment_1.AppointmentModel, {
        foreignKey: "client_id",
        as: "Appointments",
    });
    // Professional associations
    Professional_1.ProfessionalModel.belongsTo(User_1.UserModel, {
        foreignKey: "user_id",
        as: "User",
    });
    Professional_1.ProfessionalModel.belongsTo(Address_1.AddressModel, {
        foreignKey: "main_address_id",
        as: "MainAddress",
    });
    Professional_1.ProfessionalModel.hasMany(Service_1.ServiceModel, {
        foreignKey: "professional_id",
        as: "Services",
    });
    Professional_1.ProfessionalModel.belongsToMany(Amenities_1.AmenitiesModel, {
        through: "professional_amenities",
        foreignKey: "professional_id",
        otherKey: "amenity_id",
        as: "Amenities",
    });
    Professional_1.ProfessionalModel.hasMany(ProfessionalGallery_1.ProfessionalGalleryModel, {
        foreignKey: "professional_id",
        as: "Gallery",
    });
    Professional_1.ProfessionalModel.hasMany(ProfessionalAvailability_1.ProfessionalAvailabilityModel, {
        foreignKey: "professional_id",
        as: "Availabilities",
    });
    Professional_1.ProfessionalModel.hasMany(ProfessionalAvailabilityLock_1.ProfessionalAvailabilityLockModel, {
        foreignKey: "professional_id",
        as: "AvailabilityLocks",
    });
    Professional_1.ProfessionalModel.hasMany(Appointment_1.AppointmentModel, {
        foreignKey: "professional_id",
        as: "Appointments",
    });
    Professional_1.ProfessionalModel.hasMany(Favorite_1.FavoriteModel, {
        foreignKey: "professional_id",
        as: "FavoritedBy",
    });
    // Admin associations
    Admin_1.AdminModel.belongsTo(User_1.UserModel, {
        foreignKey: "user_id",
        as: "User",
    });
    Admin_1.AdminModel.hasMany(AdminServiceOrder_1.AdminServiceOrderModel, {
        foreignKey: "admin_id",
        as: "ServiceOrders",
    });
    // Category associations
    Category_1.CategoryModel.hasMany(Subcategory_1.SubCategoryModel, {
        foreignKey: "category_id",
        as: "Subcategories",
    });
    // SubCategory associations
    Subcategory_1.SubCategoryModel.belongsTo(Category_1.CategoryModel, {
        foreignKey: "category_id",
        as: "Category",
    });
    Subcategory_1.SubCategoryModel.hasMany(Service_1.ServiceModel, {
        foreignKey: "subcategory_id",
        as: "Services",
    });
    // Service associations
    Service_1.ServiceModel.belongsTo(Subcategory_1.SubCategoryModel, {
        foreignKey: "subcategory_id",
        as: "Subcategory",
    });
    Service_1.ServiceModel.belongsTo(Professional_1.ProfessionalModel, {
        foreignKey: "professional_id",
        as: "Professional",
    });
    Service_1.ServiceModel.hasMany(Appointment_1.AppointmentModel, {
        foreignKey: "service_id",
        as: "Appointments",
    });
    // Amenities associations
    Amenities_1.AmenitiesModel.belongsToMany(Professional_1.ProfessionalModel, {
        through: ProfessionalAmenities_1.ProfessionalAmenityModel,
        foreignKey: "amenity_id",
        otherKey: "professional_id",
        as: "Professionals",
    });
    // ProfessionalAmenity associations
    ProfessionalAmenities_1.ProfessionalAmenityModel.belongsTo(Professional_1.ProfessionalModel, {
        foreignKey: "professional_id",
        as: "Professional",
    });
    ProfessionalAmenities_1.ProfessionalAmenityModel.belongsTo(Amenities_1.AmenitiesModel, {
        foreignKey: "amenity_id",
        as: "Amenity",
    });
    // ProfessionalGallery associations
    ProfessionalGallery_1.ProfessionalGalleryModel.belongsTo(Professional_1.ProfessionalModel, {
        foreignKey: "professional_id",
        as: "Professional",
    });
    // ProfessionalAvailability associations
    ProfessionalAvailability_1.ProfessionalAvailabilityModel.belongsTo(Professional_1.ProfessionalModel, {
        foreignKey: "professional_id",
        as: "Professional",
    });
    // ProfessionalAvailabilityLock associations
    ProfessionalAvailabilityLock_1.ProfessionalAvailabilityLockModel.belongsTo(Professional_1.ProfessionalModel, {
        foreignKey: "professional_id",
        as: "Professional",
    });
    // Appointment associations
    Appointment_1.AppointmentModel.belongsTo(Professional_1.ProfessionalModel, {
        foreignKey: "professional_id",
        as: "Professional",
    });
    Appointment_1.AppointmentModel.belongsTo(Client_1.ClientModel, {
        foreignKey: "client_id",
        as: "Client",
    });
    Appointment_1.AppointmentModel.belongsTo(Service_1.ServiceModel, {
        foreignKey: "service_id",
        as: "Service",
    });
    Appointment_1.AppointmentModel.belongsTo(Address_1.AddressModel, {
        foreignKey: "address_id",
        as: "Address",
    });
    Appointment_1.AppointmentModel.hasMany(AdminServiceOrder_1.AdminServiceOrderModel, {
        foreignKey: "appointment_id",
        as: "ServiceOrders",
    });
    // AdminServiceOrder associations
    AdminServiceOrder_1.AdminServiceOrderModel.belongsTo(Admin_1.AdminModel, {
        foreignKey: "admin_id",
        as: "Admin",
    });
    AdminServiceOrder_1.AdminServiceOrderModel.belongsTo(Appointment_1.AppointmentModel, {
        foreignKey: "appointment_id",
        as: "Appointment",
    });
    // Favorite associations
    Favorite_1.FavoriteModel.belongsTo(User_1.UserModel, {
        foreignKey: "user_id",
        as: "User",
    });
    Favorite_1.FavoriteModel.belongsTo(Professional_1.ProfessionalModel, {
        foreignKey: "professional_id",
        as: "Professional",
    });
}
