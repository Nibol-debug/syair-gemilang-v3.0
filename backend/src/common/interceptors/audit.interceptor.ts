import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private prisma: PrismaService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const method = request.method;
    const url = request.url;
    const user = request.user; // Assumes AuthGuard is used

    // Only log mutations
    if (['POST', 'PATCH', 'DELETE', 'PUT'].includes(method)) {
      return next.handle().pipe(
        tap(async (data) => {
          if (user) {
            await this.prisma.auditLog.create({
              data: {
                user_id: user.id,
                action: method,
                module: url.split('/')[3] || 'unknown',
                data: {
                  body: request.body,
                  response: data,
                },
              },
            });
          }
        }),
      );
    }

    return next.handle();
  }
}
