"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Post = exports.User = exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
const sequelize = new sequelize_1.Sequelize('database_name', 'username', 'password', {
    host: 'localhost',
    dialect: 'mysql', // or 'postgres', 'sqlite', etc.
});
exports.sequelize = sequelize;
const User = sequelize.define('User', {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    username: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
});
exports.User = User;
const Post = sequelize.define('Post', {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    title: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    content: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
    userId: {
        type: sequelize_1.DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id',
        },
    },
});
exports.Post = Post;
