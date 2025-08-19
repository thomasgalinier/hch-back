// jwt-auth.guard.ts
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>();
    const token = req.cookies['token'];

    if (!token) throw new UnauthorizedException('Token non trouvé');

    try {
      const payload = this.jwtService.verify(token);
      req.user = payload;
      return true;
    } catch (e) {
      throw new UnauthorizedException('Token invalide', e);
    }
  }
}
