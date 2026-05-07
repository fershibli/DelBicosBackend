"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubCategoryModel = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
class SubCategoryModel extends sequelize_1.Model {
}
exports.SubCategoryModel = SubCategoryModel;
SubCategoryModel.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    title: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: sequelize_1.DataTypes.TEXT,
    },
    active: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: true,
    },
    category_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "category",
            key: "id",
        },
    },
}, {
    sequelize: database_1.sequelize,
    modelName: "SubCategory",
    tableName: "subcategory",
    underscored: true,
    timestamps: true,
});
