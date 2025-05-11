// lib/swaggerConfig.ts
import swaggerJSDoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Next.js API Docs',
      version: '1.0.0',
      description: 'Auto-generated API documentation using Swagger',
    },
  },
  apis: ['app/api/**/*.ts'], // Make sure this path is correct for your API routes
};

export const swaggerSpec = swaggerJSDoc(options);
