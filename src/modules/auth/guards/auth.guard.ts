import { RequestAuth } from '@/shared/interfaces/request-auth.interface';
import { UserPayload } from '@/shared/interfaces/user-payload.interface';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request: RequestAuth = context.switchToHttp().getRequest();
    const token = request.cookies.token;

    if (!token) return false;

    try {
      const payload: UserPayload = this.jwtService.verify(token);
      request.userId = payload.id;
      return true;
    } catch (e: unknown) {
      console.error('Erro ao verificar JWT:', e);
      throw new UnauthorizedException('Token inválido ou expirado');
    }
  }
}
