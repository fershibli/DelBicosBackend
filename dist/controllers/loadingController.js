"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loading = void 0;
const loading = (req, res) => {
    res.status(200).json({ message: 'Loading screen endpoint' });
};
exports.loading = loading;
