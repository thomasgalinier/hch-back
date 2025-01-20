import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
export type Role = "ADMIN" | "SUPER_ADMIN" | "TECHNICIEN" | "CLIENT";
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<Role[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const hasRole = () => roles.includes(user.role);
    if(!user || !hasRole()) {
      throw new UnauthorizedException('Vous n\'avez pas les droits pour accéder à cette ressource');
    }
    return true;
  }
}