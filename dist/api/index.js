"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const routes_1 = require("../routes");
const sequelize_1 = require("sequelize");
// Example: replace with your actual database connection details
const sequelize = new sequelize_1.Sequelize('database', 'username', 'password', {
    host: 'localhost',
    dialect: 'mysql', // or 'postgres', 'sqlite', etc.
});
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use(express_1.default.json());
(0, routes_1.setRoutes)(app);
sequelize.authenticate()
    .then(() => {
    console.log('Database connection established successfully.');
})
    .catch((err) => {
    console.error('Unable to connect to the database:', err);
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
exports.default = app;
