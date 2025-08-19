import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesGuard } from './role.middleware';

describe('RolesGuard', () => {
  const makeCtx = (user: any = null): ExecutionContext => ({
    switchToHttp: () => ({ getRequest: () => ({ user }) }),
    getHandler: () => ({} as any),
    getClass: () => ({} as any),
  }) as any;

  it('autorise si aucun rôle requis', () => {
    const reflector = { get: jest.fn().mockReturnValue(undefined) } as any as Reflector;
    const guard = new RolesGuard(reflector);
    expect(guard.canActivate(makeCtx({ role: 'CLIENT' }))).toBe(true);
  });

  it('rejette si rôle non autorisé', () => {
    const reflector = { get: jest.fn().mockReturnValue(['ADMIN']) } as any as Reflector;
    const guard = new RolesGuard(reflector);
    expect(() => guard.canActivate(makeCtx({ role: 'CLIENT' }))).toThrow(UnauthorizedException);
  });

  it('autorise si rôle autorisé', () => {
    const reflector = { get: jest.fn().mockReturnValue(['ADMIN','SUPER_ADMIN']) } as any as Reflector;
    const guard = new RolesGuard(reflector);
    expect(guard.canActivate(makeCtx({ role: 'SUPER_ADMIN' }))).toBe(true);
  });
});
