/**
 * Swagger Documentation Setup
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Serves interactive API documentation using Swagger UI.
 * 
 * Endpoints:
 *   - /docs       - Swagger UI (interactive documentation)
 *   - /docs/json  - OpenAPI spec in JSON format
 *   - /docs/yaml  - OpenAPI spec in YAML format
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');
const fs = require('fs');

/**
 * Load and parse OpenAPI specification
 */
function loadOpenAPISpec() {
  const specPath = path.join(__dirname, '../docs/openapi.yaml');
  
  if (!fs.existsSync(specPath)) {
    console.error('OpenAPI spec not found at:', specPath);
    return null;
  }
  
  try {
    return YAML.load(specPath);
  } catch (err) {
    console.error('Error loading OpenAPI spec:', err.message);
    return null;
  }
}

/**
 * Swagger UI configuration options
 */
const swaggerOptions = {
  customCss: `
    .swagger-ui .topbar { display: none; }
    .swagger-ui .info .title { color: #6366f1; }
    .swagger-ui .info .description { 
      background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
      padding: 20px;
      border-radius: 8px;
      color: #e2e8f0;
    }
    .swagger-ui .info .description h1,
    .swagger-ui .info .description h2,
    .swagger-ui .info .description h3 {
      color: #a5b4fc;
    }
    .swagger-ui .info .description code {
      background: #334155;
      padding: 2px 6px;
      border-radius: 4px;
    }
    .swagger-ui .info .description table {
      border-collapse: collapse;
      margin: 10px 0;
    }
    .swagger-ui .info .description th,
    .swagger-ui .info .description td {
      border: 1px solid #475569;
      padding: 8px 12px;
    }
    .swagger-ui .info .description th {
      background: #334155;
    }
    .swagger-ui .opblock-tag { 
      border-bottom: 1px solid #e2e8f0;
    }
    .swagger-ui .opblock.opblock-get .opblock-summary-method {
      background: #22c55e;
    }
    .swagger-ui .opblock.opblock-post .opblock-summary-method {
      background: #3b82f6;
    }
    .swagger-ui .opblock.opblock-put .opblock-summary-method {
      background: #f59e0b;
    }
    .swagger-ui .opblock.opblock-delete .opblock-summary-method {
      background: #ef4444;
    }
    .swagger-ui .btn.execute {
      background: #6366f1;
      border-color: #6366f1;
    }
    .swagger-ui .btn.execute:hover {
      background: #4f46e5;
    }
  `,
  customSiteTitle: 'Monomorph API Docs',
  customfavIcon: '/favicon.ico',
  swaggerOptions: {
    persistAuthorization: true,
    displayRequestDuration: true,
    docExpansion: 'none',
    filter: true,
    showExtensions: true,
    showCommonExtensions: true,
    tryItOutEnabled: true,
  },
};

/**
 * Setup Swagger documentation routes
 * 
 * @param {Express} app - Express application
 */
function setupSwagger(app) {
  const spec = loadOpenAPISpec();
  
  if (!spec) {
    console.warn('Swagger documentation disabled - spec not found');
    return;
  }
  
  // Serve OpenAPI spec as JSON
  app.get('/docs/json', (req, res) => {
    res.json(spec);
  });
  
  // Serve OpenAPI spec as YAML
  app.get('/docs/yaml', (req, res) => {
    const yamlPath = path.join(__dirname, '../docs/openapi.yaml');
    res.type('text/yaml').sendFile(yamlPath);
  });
  
  // Serve Swagger UI
  app.use('/docs', swaggerUi.serve);
  app.get('/docs', swaggerUi.setup(spec, swaggerOptions));
  
  console.log('📚 Swagger documentation available at /docs');
}

module.exports = { setupSwagger, loadOpenAPISpec };
