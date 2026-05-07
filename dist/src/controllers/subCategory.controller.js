"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllSubCategories = void 0;
const Subcategory_1 = require("../models/Subcategory");
const Category_1 = require("../models/Category");
const getAllSubCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categoryId = req.params.id;
        // Verificar se a categoria existe
        const category = yield Category_1.CategoryModel.findOne({
            where: { id: categoryId, active: true },
        });
        if (!category) {
            return res.status(404).json({ error: "Categoria não encontrada" });
        }
        // Buscar subcategorias da categoria específica
        const subcategories = yield Subcategory_1.SubCategoryModel.findAll({
            where: {
                category_id: categoryId,
                active: true,
            },
            order: [["title", "ASC"]],
        });
        return res.json(subcategories);
    }
    catch (error) {
        console.error("Erro ao buscar subcategorias:", error);
        return res.status(500).json({
            error: "Erro interno do servidor",
            message: error.message,
        });
    }
});
exports.getAllSubCategories = getAllSubCategories;
