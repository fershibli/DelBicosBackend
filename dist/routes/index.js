"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setRoutes = setRoutes;
const express_1 = require("express");
const controllers_1 = require("../controllers");
const router = (0, express_1.Router)();
const indexController = new controllers_1.IndexController();
function setRoutes(app) {
    app.get('/', indexController.getIndex.bind(indexController));
    // Add more routes here as needed
}
