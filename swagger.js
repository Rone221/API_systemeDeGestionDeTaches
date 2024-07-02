const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Documentation API SYSNOTE",
      version: "1.0.0",
      description: "Documentation de l'API de SYSNOTE",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Serveur local",
      },
    ],
  },
  apis: ["./index.js"], // Fichiers contenant les annotations Swagger
};

const specs = swaggerJsdoc(options);

module.exports = { swaggerUi, specs };
