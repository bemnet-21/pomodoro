import swaggerJsdoc from 'swagger-jsdoc';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const routesGlob = path.resolve(__dirname, 'routes', '*.js').replace(/\\/g, '/');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Pomodoro API',
      version: '1.0.0',
      description: 'API documentation for the Pomodoro backend',
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Local development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        SignupRequest: {
          type: 'object',
          required: ['username', 'email', 'password'],
          properties: {
            username: { type: 'string', example: 'john_doe' },
            email: { type: 'string', format: 'email', example: 'john@example.com' },
            password: { type: 'string', minLength: 6, example: 'secret123' },
          },
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email', example: 'john@example.com' },
            password: { type: 'string', minLength: 6, example: 'secret123' },
          },
        },
        AuthSuccessResponse: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Login successful' },
            user: {
              type: 'object',
              properties: {
                id: { type: 'string', example: '6848a7aa1f95e4dd4e5dd1b2' },
                username: { type: 'string', example: 'john_doe' },
                email: { type: 'string', format: 'email', example: 'john@example.com' },
              },
            },
            token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            error: { type: 'string', example: 'Invalid email or password' },
          },
        },
        SessionCreateRequest: {
          type: 'object',
          required: ['taskName', 'sessionType', 'startTime', 'endTime', 'actualDurationSeconds', 'plannedDurationSeconds'],
          properties: {
            taskName: { type: 'string', example: 'Write API docs' },
            sessionType: { type: 'string', enum: ['work', 'short-break', 'long-break'], example: 'work' },
            status: { type: 'string', enum: ['completed', 'abandoned'], example: 'completed' },
            startTime: { type: 'string', format: 'date-time', example: '2026-06-12T18:00:00.000Z' },
            endTime: { type: 'string', format: 'date-time', example: '2026-06-12T18:25:00.000Z' },
            actualDurationSeconds: { type: 'integer', example: 1500 },
            plannedDurationSeconds: { type: 'integer', example: 1500 },
          },
        },
        Session: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '6848a7aa1f95e4dd4e5dd1b2' },
            user: { type: 'string', example: '6848a7aa1f95e4dd4e5dd1aa' },
            taskName: { type: 'string', example: 'Write API docs' },
            sessionType: { type: 'string', example: 'work' },
            status: { type: 'string', example: 'completed' },
            startTime: { type: 'string', format: 'date-time' },
            endTime: { type: 'string', format: 'date-time' },
            actualDurationSeconds: { type: 'integer', example: 1500 },
            plannedDurationSeconds: { type: 'integer', example: 1500 },
            tags: {
              type: 'array',
              items: { type: 'string' },
              example: ['deep-work', 'backend'],
            },
            focusRating: { type: 'integer', minimum: 1, maximum: 5, example: 4 },
            distractions: { type: 'integer', example: 1 },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        SessionCreateResponse: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Session created successfully' },
            data: { $ref: '#/components/schemas/Session' },
          },
        },
        SessionListResponse: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Sessions retrieved successfully' },
            data: {
              type: 'array',
              items: { $ref: '#/components/schemas/Session' },
            },
          },
        },
        SessionDetailResponse: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Session retrieved successfully' },
            data: { $ref: '#/components/schemas/Session' },
          },
        },
        DeleteSessionResponse: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Session deleted successfully' },
          },
        },
        UserSettings: {
          type: 'object',
          properties: {
            workDuration: { type: 'integer', minimum: 1, maximum: 180, example: 25 },
            shortBreak: { type: 'integer', minimum: 1, maximum: 60, example: 5 },
            longBreak: { type: 'integer', minimum: 1, maximum: 60, example: 15 },
            longBreakInterval: { type: 'integer', minimum: 1, maximum: 10, example: 4 },
            autoStartBreaks: { type: 'boolean', example: false },
            autoStartWork: { type: 'boolean', example: false },
            alarmSound: { type: 'string', example: 'digital_bell' },
            volume: { type: 'integer', minimum: 0, maximum: 100, example: 50 },
          },
        },
        UserSettingsUpdateRequest: {
          type: 'object',
          properties: {
            workDuration: { type: 'integer', minimum: 1, maximum: 180, example: 30 },
            shortBreak: { type: 'integer', minimum: 1, maximum: 60, example: 5 },
            longBreak: { type: 'integer', minimum: 1, maximum: 60, example: 20 },
            longBreakInterval: { type: 'integer', minimum: 1, maximum: 10, example: 4 },
            autoStartBreaks: { type: 'boolean', example: true },
            autoStartWork: { type: 'boolean', example: false },
            alarmSound: { type: 'string', example: 'digital_bell' },
            volume: { type: 'integer', minimum: 0, maximum: 100, example: 70 },
          },
        },
        UserSettingsResponse: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'User settings retrieved successfully' },
            data: { $ref: '#/components/schemas/UserSettings' },
          },
        },
        UserSummary: {
          type: 'object',
          properties: {
            currentStreak: { type: 'integer', example: 3 },
            totalFocusHours: { type: 'integer', example: 42 },
            totalSessions: { type: 'integer', example: 120 },
            lastActive: { type: 'string', format: 'date-time', example: '2026-06-12T18:25:00.000Z' },
          },
        },
        UserSummaryResponse: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'User summary retrieved successfully' },
            data: { $ref: '#/components/schemas/UserSummary' },
          },
        },
      },
    },
  },
  apis: [routesGlob],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
