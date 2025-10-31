export default () => ({
  cors: {
    origins: process.env.CORS_ORIGINS?.split(',').map((origin) =>
      origin.trim(),
    ) || ['http://localhost:3000'],
    credentials: process.env.CORS_CREDENTIALS === 'true',
    methods: process.env.CORS_METHODS?.split(',') || [
      'GET',
      'POST',
      'PUT',
      'PATCH',
      'DELETE',
      'OPTIONS',
    ],
    allowedHeaders: process.env.CORS_ALLOWED_HEADERS?.split(',') || [
      'Content-Type',
      'Authorization',
    ],
    exposedHeaders: process.env.CORS_EXPOSED_HEADERS?.split(',') || [
      'Content-Length',
      'X-Request-Id',
    ],
    maxAge: parseInt(process.env.CORS_MAX_AGE || '86400', 10),
  },
  app: {
    port: parseInt(process.env.PORT || '3000', 10),
    nodeEnv: process.env.NODE_ENV || 'development',
  },
});
