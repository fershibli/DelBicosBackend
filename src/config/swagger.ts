import { Options } from "swagger-jsdoc";

const isProduction =
  process.env.ENVIRONMENT === "production" ||
  process.env.NODE_ENV === "production";

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
  apis: isProduction
    ? ["./dist/routes/*.js", "./dist/models/*.js"]
    : ["./src/routes/*.ts", "./src/models/*.ts"],
};

export default swaggerOptions;
