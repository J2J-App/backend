import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Jeepedia API',
      version: '1.0.0',
      description: `
Jeepedia is a centralized platform that provides curated data and tools for students participating in engineering admissions through JoSAA, JAC Delhi, and other counselling authorities in India.

This API powers the backend of the Jeepedia platform, offering access to:

- College prediction based on JEE ranks
- Detailed information about participating institutes
- Opening & closing ranks
- Placement data and statistics
- Comparative tools between colleges and branches

**Base URL:** \`https://api.jeepedia.in\`

_No authentication required for public routes._

[GitHub Repo](https://github.com/J2J-App/backend)
      `,
    },
    servers: [
      {
        url: 'https://api.jeepedia.in',
        description: 'Production server'
      },
      {
        url: 'http://localhost:3000',
        description: 'Development server'
      },
    ],
    paths: {
      '/api/v1/healthcheck': {
        get: {
          tags: ['Health Check'],
          summary: 'Health check endpoint',
          description: 'Check if the API is running and healthy',
          responses: {
            200: {
              description: 'API is healthy',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      statusCode: { type: 'number', example: 200 },
                      data: { type: 'string', example: 'OK' },
                      message: { type: 'string', example: 'Health check passed' }
                    }
                  }
                }
              }
            }
          }
        }
      },
      '/api/v1/getBranches': {
        post: {
          tags: ['Branch Prediction'],
          summary: 'Get eligible branches based on rank and category',
          description: 'Predict eligible branches for JAC Delhi counselling based on user rank, domicile, and category',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['rank', 'domicile', 'category'],
                  properties: {
                    rank: { type: 'number', example: 1500, description: 'JEE Main rank' },
                    domicile: { type: 'string', enum: ['Delhi', 'Outside Delhi'], example: 'Delhi' },
                    category: { type: 'string', enum: ['General', 'OBC', 'SC', 'ST'], example: 'General' }
                  }
                }
              }
            }
          },
          responses: {
            200: {
              description: 'Eligible branches retrieved successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      statusCode: { type: 'number', example: 200 },
                      data: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            college: { type: 'string' },
                            branch: { type: 'string' },
                            closing_rank: { type: 'number' }
                          }
                        }
                      },
                      message: { type: 'string', example: 'Branches fetched successfully' }
                    }
                  }
                }
              }
            },
            400: {
              description: 'Bad request - missing or invalid parameters'
            }
          }
        }
      },
      '/api/v2/cutoff/predictor': {
        post: {
          tags: ['Cutoff Prediction'],
          summary: 'Predict college admission chances',
          description: 'Advanced predictor for JoSAA, JAC Delhi, and other counselling authorities',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['counselling', 'rank', 'year'],
                  properties: {
                    counselling: { type: 'string', enum: ['josaa', 'jac_delhi'], example: 'josaa' },
                    rank: { type: 'number', example: 2500 },
                    domicile: { type: 'string', example: 'Delhi' },
                    category: { type: 'string', example: 'General' },
                    subcategory: { type: 'string', example: 'General-EWS' },
                    year: { type: 'number', example: 2024 },
                    college_type: { type: 'string', example: 'IIT' },
                    adv_rank: { type: 'number', example: 1200 },
                    gender: { type: 'string', enum: ['Male', 'Female'], example: 'Male' }
                  }
                }
              }
            }
          },
          responses: {
            200: {
              description: 'Prediction results',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      statusCode: { type: 'number', example: 200 },
                      data: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            college: { type: 'string' },
                            branch: { type: 'string' },
                            probability: { type: 'string' },
                            cutoff: { type: 'number' }
                          }
                        }
                      },
                      message: { type: 'string' }
                    }
                  }
                }
              }
            }
          }
        }
      },
      '/api/v2/cutoff': {
        post: {
          tags: ['Cutoff Data'],
          summary: 'Get historical cutoff data',
          description: 'Retrieve cutoff trends and historical data',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    college: { type: 'string', example: 'DTU' },
                    branch: { type: 'string', example: 'Computer Science and Engineering' },
                    category: { type: 'string', example: 'General' },
                    year: { type: 'number', example: 2024 }
                  }
                }
              }
            }
          },
          responses: {
            200: {
              description: 'Cutoff data retrieved successfully'
            }
          }
        }
      },
      '/api/v1/getCollegeBranches': {
        get: {
          tags: ['College Data'],
          summary: 'Get all college branches',
          description: 'Retrieve list of all available college branches',
          responses: {
            200: {
              description: 'College branches retrieved successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      statusCode: { type: 'number', example: 200 },
                      data: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            college: { type: 'string' },
                            branches: {
                              type: 'array',
                              items: { type: 'string' }
                            }
                          }
                        }
                      },
                      message: { type: 'string' }
                    }
                  }
                }
              }
            }
          }
        }
      },
      '/api/v1/getCollegeData': {
        get: {
          tags: ['College Data'],
          summary: 'Get college information',
          description: 'Retrieve detailed information about colleges',
          responses: {
            200: {
              description: 'College data retrieved successfully'
            }
          }
        }
      },
      '/api/v1/getSeatMatrix': {
        get: {
          tags: ['Seat Matrix'],
          summary: 'Get seat matrix data',
          description: 'Retrieve seat availability matrix for colleges',
          responses: {
            200: {
              description: 'Seat matrix data retrieved successfully'
            }
          }
        }
      },
      '/api/v1/getSeatMatrix/categorydescription': {
        get: {
          tags: ['Seat Matrix'],
          summary: 'Get category descriptions',
          description: 'Retrieve descriptions for different seat categories',
          responses: {
            200: {
              description: 'Category descriptions retrieved successfully'
            }
          }
        }
      },
      '/api/v1/getSeatMatrix/totalseats': {
        get: {
          tags: ['Seat Matrix'],
          summary: 'Get total seats information',
          description: 'Retrieve total seat counts across colleges',
          responses: {
            200: {
              description: 'Total seats data retrieved successfully'
            }
          }
        }
      },
      '/api/v1/getPlacement': {
        post: {
          tags: ['Placement Data'],
          summary: 'Get placement statistics',
          description: 'Retrieve placement data for specific college and branch',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['college', 'branch', 'year'],
                  properties: {
                    college: { type: 'string', example: 'DTU' },
                    branch: { type: 'string', example: 'Computer Science and Engineering' },
                    year: { type: 'number', example: 2024 }
                  }
                }
              }
            }
          },
          responses: {
            200: {
              description: 'Placement data retrieved successfully'
            }
          }
        }
      },
      '/api/v1/getPlacementByBranch': {
        post: {
          tags: ['Placement Data'],
          summary: 'Get placement data by branch',
          description: 'Retrieve placement statistics filtered by branch',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['college', 'branch'],
                  properties: {
                    college: { type: 'string', example: 'DTU' },
                    branch: { type: 'string', example: 'Computer Science and Engineering' }
                  }
                }
              }
            }
          },
          responses: {
            200: {
              description: 'Branch placement data retrieved successfully'
            }
          }
        }
      },
      '/api/v2/placement': {
        post: {
          tags: ['Placement Data'],
          summary: 'Get comprehensive placement data',
          description: 'Retrieve detailed placement statistics and trends',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    college: { type: 'string' },
                    branch: { type: 'string' },
                    year: { type: 'number' }
                  }
                }
              }
            }
          },
          responses: {
            200: {
              description: 'Placement data retrieved successfully'
            }
          }
        }
      },
      '/api/v2/placement/getPlacement': {
        post: {
          tags: ['Placement Data'],
          summary: 'Compare placement data',
          description: 'Compare placement statistics between colleges/branches',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    colleges: {
                      type: 'array',
                      items: { type: 'string' }
                    },
                    branches: {
                      type: 'array',
                      items: { type: 'string' }
                    }
                  }
                }
              }
            }
          },
          responses: {
            200: {
              description: 'Placement comparison data retrieved successfully'
            }
          }
        }
      },
      '/api/v1/getRank': {
        post: {
          tags: ['Rank Services'],
          summary: 'Get rank information',
          description: 'Retrieve rank-related information and statistics',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    rank: { type: 'number', example: 1500 },
                    category: { type: 'string', example: 'General' }
                  }
                }
              }
            }
          },
          responses: {
            200: {
              description: 'Rank information retrieved successfully'
            }
          }
        }
      },
      '/api/v1/postRank': {
        post: {
          tags: ['Rank Services'],
          summary: 'Store rank data',
          description: 'Store user rank information for analytics',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    rank: { type: 'number' },
                    category: { type: 'string' },
                    exam: { type: 'string' },
                    year: { type: 'number' }
                  }
                }
              }
            }
          },
          responses: {
            200: {
              description: 'Rank data stored successfully'
            }
          }
        }
      },
      '/api/v2/about': {
        post: {
          tags: ['College Information'],
          summary: 'Get college about information',
          description: 'Retrieve detailed information about a specific college',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['college'],
                  properties: {
                    college: { type: 'string', example: 'dtu-delhi', description: 'College identifier' }
                  }
                }
              }
            }
          },
          responses: {
            200: {
              description: 'College information retrieved successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      statusCode: { type: 'number', example: 200 },
                      data: {
                        type: 'object',
                        properties: {
                          name: { type: 'string' },
                          location: { type: 'string' },
                          established: { type: 'string' },
                          description: { type: 'string' },
                          facilities: { type: 'array', items: { type: 'string' } }
                        }
                      },
                      message: { type: 'string', example: 'College information fetched successfully' }
                    }
                  }
                }
              }
            }
          }
        }
      },
      '/api/v2/about/photo': {
        get: {
          tags: ['College Information'],
          summary: 'Get college photos',
          description: 'Retrieve collection of college photos and images',
          responses: {
            200: {
              description: 'College photos retrieved successfully'
            }
          }
        }
      },
      '/api/v2/about/seat-matrix': {
        post: {
          tags: ['College Information'],
          summary: 'Get college seat matrix',
          description: 'Retrieve seat matrix information for a specific college',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    college: { type: 'string' },
                    year: { type: 'number' }
                  }
                }
              }
            }
          },
          responses: {
            200: {
              description: 'Seat matrix retrieved successfully'
            }
          }
        }
      },
      '/api/v2/about/branches': {
        post: {
          tags: ['College Information'],
          summary: 'Get college branches',
          description: 'Retrieve available branches for a specific college',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    college: { type: 'string' }
                  }
                }
              }
            }
          },
          responses: {
            200: {
              description: 'College branches retrieved successfully'
            }
          }
        }
      },
      '/api/v2/about/placement-branches': {
        post: {
          tags: ['College Information'],
          summary: 'Get placement branches',
          description: 'Retrieve branches with placement data for a specific college',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    college: { type: 'string' }
                  }
                }
              }
            }
          },
          responses: {
            200: {
              description: 'Placement branches retrieved successfully'
            }
          }
        }
      }
    },
  },
  apis: ['./src/routes/*.js'], // Path to the API docs
};

const swaggerSpec = swaggerJSDoc(options);

function swaggerDocs(app) {
  // Serve swagger spec as JSON
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  // For production (Vercel), serve a custom HTML page with dark theme CSS
  if (process.env.NODE_ENV === 'production') {
    app.get('/docs', (req, res) => {
      const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Jeepedia API Documentation</title>
  <link rel="stylesheet" type="text/css" href="https://unpkg.com/swagger-ui-dist@4.15.5/swagger-ui.css" />
  <style>
    html { box-sizing: border-box; overflow: -moz-scrollbars-vertical; overflow-y: scroll; background: #121212 !important; }
    *, *:before, *:after { box-sizing: inherit; }
    body { margin:0; background: #121212 !important; color: #f8fafc !important; }
    #swagger-ui { background: #121212 !important; }
    .swagger-ui .topbar { display: none; }
    .swagger-ui { background: #121212 !important; color: #f8fafc !important; }
    .swagger-ui .wrapper { background: #121212 !important; color: #f8fafc !important; }
    .swagger-ui .info { background: #121212 !important; color: #f8fafc !important; padding: 20px !important; margin-bottom: 20px !important; }
    .swagger-ui .information-container { background: #121212 !important; color: #f8fafc !important; }
    .swagger-ui .info .title { background: #121212 !important; color: #f8fafc !important; }
    body > div.swagger-ui { background: #121212 !important; }
    * { background-color: inherit !important; color: #f8fafc !important; }
    .swagger-ui .servers { background: #23272b !important; color: #f8fafc !important; }
    .swagger-ui .scheme-container { background: #23272b !important; color: #f8fafc !important; }
    .swagger-ui .opblock { background: #23272b !important; border: 1px solid #334155 !important; }
    .swagger-ui .opblock.opblock-post { border-left: 4px solid #10b981 !important; }
    .swagger-ui .opblock.opblock-get { border-left: 4px solid #3b82f6 !important; }
    .swagger-ui .btn.execute { background: linear-gradient(135deg, #3b82f6, #6366f1) !important; border: none !important; box-shadow: 0 4px 12px rgba(59,130,246,0.4) !important; color: #fff !important; }
    .swagger-ui .opblock-tag { background: linear-gradient(135deg, #23272b, #121212) !important; color: #f8fafc !important; border: 1px solid #334155 !important; }
    .swagger-ui table { background: #23272b !important; border: 1px solid #334155 !important; }
    .swagger-ui table thead tr { background: #121212 !important; }
    .swagger-ui table thead tr th, .swagger-ui table tbody tr td { color: #f8fafc !important; border-color: #334155 !important; }
    .swagger-ui .highlight-code { background: #121212 !important; color: #f8fafc !important; }
    .swagger-ui input, .swagger-ui textarea, .swagger-ui select { background: #23272b !important; border: 1px solid #334155 !important; color: #f8fafc !important; }
  </style>
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@4.15.5/swagger-ui-bundle.js"></script>
  <script src="https://unpkg.com/swagger-ui-dist@4.15.5/swagger-ui-standalone-preset.js"></script>
  <script>
    window.onload = function() {
      SwaggerUIBundle({
        url: '/api-docs.json',
        dom_id: '#swagger-ui',
        deepLinking: true,
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIStandalonePreset
        ],
        plugins: [
          SwaggerUIBundle.plugins.DownloadUrl
        ],
        layout: "StandaloneLayout"
      });
    };
  </script>
</body>
</html>`;
      res.send(html);
    });
  } else {
    // For development, use the normal swagger-ui-express with custom dark CSS
    const customCss = `
      html { background: #121212 !important; }
      body { background: #121212 !important; color: #f8fafc !important; }
      #swagger-ui { background: #121212 !important; }
      .swagger-ui .topbar { display: none !important; }
      .swagger-ui { background: #121212 !important; color: #f8fafc !important; }
      .swagger-ui .wrapper { background: #121212 !important; color: #f8fafc !important; }
      .swagger-ui .info { background: #121212 !important; color: #f8fafc !important; padding: 20px !important; margin-bottom: 20px !important; }
      .swagger-ui .information-container { background: #121212 !important; color: #f8fafc !important; }
      .swagger-ui .info .title { background: #121212 !important; color: #f8fafc !important; }
      body > div.swagger-ui { background: #121212 !important; }
      * { background-color: inherit !important; color: #f8fafc !important; }
      .swagger-ui .servers { background: #23272b !important; color: #f8fafc !important; }
      .swagger-ui .scheme-container { background: #121212 !important; color: #f8fafc !important; }
      .swagger-ui .opblock { background: #23272b !important; border: 1px solid #334155 !important; }
      .swagger-ui .opblock.opblock-post { border-left: 4px solid #10b981 !important; }
      .swagger-ui .opblock.opblock-get { border-left: 4px solid #3b82f6 !important; }
      .swagger-ui .btn.execute { background: linear-gradient(135deg, #3b82f6, #6366f1) !important; border: none !important; box-shadow: 0 4px 12px rgba(59,130,246,0.4) !important; color: #fff !important; }
      .swagger-ui .opblock-tag { background: linear-gradient(135deg, #23272b, #121212) !important; color: #f8fafc !important; border: 1px solid #334155 !important; }
      .swagger-ui table { background: #23272b !important; border: 1px solid #334155 !important; }
      .swagger-ui table thead tr { background: #121212 !important; }
      .swagger-ui table thead tr th, .swagger-ui table tbody tr td { color: #f8fafc !important; border-color: #334155 !important; }
      .swagger-ui .highlight-code { background: #121212 !important; color: #f8fafc !important; }
      .swagger-ui input, .swagger-ui textarea, .swagger-ui select { background: #23272b !important; border: 1px solid #334155 !important; color: #f8fafc !important; }
    `;
    app.use('/docs', swaggerUi.serve);
    app.get('/docs', swaggerUi.setup(swaggerSpec, {
      customCss,
      customSiteTitle: "Jeepedia API Documentation - Dark Edition"
    }));
  }
  
  // Root endpoint
  app.get('/', (req, res) => {
    if (process.env.NODE_ENV === 'production') {
      res.json({
        message: 'Jeepedia API is running',
        documentation: '/docs',
        health: '/api/v1/healthcheck',
        version: '1.0.0',
        endpoints: {
          healthcheck: '/api/v1/healthcheck',
          branches: '/api/v1/getBranches',
          cutoff: '/api/v2/cutoff',
          placement: '/api/v2/placement',
          about: '/api/v2/about'
        }
      });
    } else {
      res.redirect('/docs');
    }
  });
}

export default swaggerDocs;
