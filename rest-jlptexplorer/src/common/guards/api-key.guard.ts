import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { timingSafeEqual } from 'crypto';
import { Request } from 'express';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const provided = request.headers['x-api-key'];
    const expected = process.env['ADMIN_API_KEY'];

    if (!expected) {
      throw new Error('ADMIN_API_KEY environment variable is not set');
    }

    if (typeof provided !== 'string') {
      throw new UnauthorizedException();
    }

    const providedBuf = Buffer.from(provided);
    const expectedBuf = Buffer.from(expected);

    if (
      providedBuf.length !== expectedBuf.length ||
      !timingSafeEqual(providedBuf, expectedBuf)
    ) {
      throw new UnauthorizedException();
    }

    return true;
  }
}
