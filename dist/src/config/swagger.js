"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "DelBicos API",
            version: "1.0.0",
            description: "Documentação das rotas da API DelBicos",
        },
        servers: [
            { url: "http://localhost:3000/api", description: "Servidor local" },
            {
                url: "https://delbicosbackend.onrender.com/api",
                description: "Servidor de produção",
            },
        ],
    },
    apis: ["./src/routes/*.ts", "./src/models/*.ts"],
};
exports.default = swaggerOptions;
