import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Response } from 'express';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(PrismaExceptionFilter.name);

  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    switch (exception.code) {
      case 'P2002':
        return response
          .status(HttpStatus.CONFLICT)
          .json({ error: 'Resource already exists' });
      case 'P2025':
        return response
          .status(HttpStatus.NOT_FOUND)
          .json({ error: 'Resource not found' });
      case 'P2003':
        return response
          .status(HttpStatus.BAD_REQUEST)
          .json({ error: 'Foreign key constraint failed' });
      case 'P2014':
        return response
          .status(HttpStatus.BAD_REQUEST)
          .json({ error: 'Relation constraint failed' });
      case 'P2000':
        return response
          .status(HttpStatus.BAD_REQUEST)
          .json({ error: 'Value too long for column' });
      default:
        this.logger.error(
          `Unhandled Prisma error: ${exception.code} — ${exception.message}`,
        );
        return response
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ error: 'Database error' });
    }
  }
}
