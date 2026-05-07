import { Options } from "swagger-jsdoc";
import path from "path";

const isProduction =
  process.env.ENVIRONMENT === "production" ||
  process.env.NODE_ENV === "production";

// In production, __dirname is /app/dist/src/config — resolve up to dist/src/
// In development, __dirname is /…/src/config — resolve up to src/
const routesGlob = path.resolve(__dirname, "../routes/*.js");
const modelsGlob = path.resolve(__dirname, "../models/*.js");
const routesGlobTs = path.resolve(__dirname, "../routes/*.ts");
const modelsGlobTs = path.resolve(__dirname, "../models/*.ts");

const swaggerOptions: Options = {
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
        description: "Servidor de produção (Render)",
      },
    ],
  },
  apis: isProduction ? [routesGlob, modelsGlob] : [routesGlobTs, modelsGlobTs],
};

export default swaggerOptions;
