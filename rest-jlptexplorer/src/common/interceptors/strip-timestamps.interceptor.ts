import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

function stripCreatedAt(obj: unknown): unknown {
  if (Array.isArray(obj)) return obj.map(stripCreatedAt);
  if (obj !== null && typeof obj === 'object') {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
      if (key === 'created_at') continue;
      result[key] = stripCreatedAt(value);
    }
    return result;
  }
  return obj;
}

@Injectable()
export class StripTimestampsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(map(stripCreatedAt));
  }
}
