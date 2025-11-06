import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const startTime = Date.now();

    // Enhanced logging for HTTP requests
    console.log(
      `[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`,
    );

    // Log additional info for POST requests (like REST API calls)
    if (req.method === 'POST' && req.body && Object.keys(req.body).length > 0) {
      console.log(
        `[${new Date().toISOString()}] Request Body Keys:`,
        Object.keys(req.body),
      );
    }

    // Track response time
    res.on('finish', () => {
      const duration = Date.now() - startTime;
      console.log(
        `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - ${res.statusCode} (${duration}ms)`,
      );
    });

    next();
  }
}
