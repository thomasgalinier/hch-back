import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { RolesGuard } from '../common/middleware/role.middleware';
import { ExecutionContext } from '@nestjs/common';

// Simple allow-all guard mock for controller unit tests
class AllowGuard {
  canActivate() {
    return true;
  }
}

describe('AuthController (unit)', () => {
  let controller: AuthController;
  let service: {
    signup: jest.Mock;
    signin: jest.Mock;
    getAll: jest.Mock;
    delete: jest.Mock;
    update: jest.Mock;
    getTechnicien: jest.Mock;
    getClient: jest.Mock;
    logout: jest.Mock;
  };

  beforeEach(async () => {
    service = {
      signup: jest.fn(),
      signin: jest.fn(),
      getAll: jest.fn(),
      delete: jest.fn(),
      update: jest.fn(),
      getTechnicien: jest.fn(),
      getClient: jest.fn(),
      logout: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: service }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(new AllowGuard())
      .overrideGuard(RolesGuard)
      .useValue(new AllowGuard())
      .compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('signup appelle service.signup', async () => {
    service.signup.mockResolvedValue({ token: 't', user: { id: '1' } });
    const out = await controller.signup({} as any);
    expect(service.signup).toHaveBeenCalled();
    expect(out).toEqual({ token: 't', user: { id: '1' } });
  });

  it('signin appelle service.signin et retourne user', async () => {
    const res: any = { cookie: jest.fn() };
    service.signin.mockResolvedValue({ user: { id: '1' } });
    const out = await controller.signin({} as any, res);
    expect(service.signin).toHaveBeenCalled();
    expect(out).toEqual({ user: { id: '1' } });
  });

  it('getAll appelle service.getAll', async () => {
    service.getAll.mockResolvedValue([{ id: '1' }]);
    const out = await controller.getAll();
    expect(out).toEqual([{ id: '1' }]);
  });

  it('delete appelle service.delete', async () => {
    service.delete.mockResolvedValue({ id: '1' });
    const out = await controller.delete({} as any);
    expect(out).toEqual({ id: '1' });
  });

  it('update appelle service.update', async () => {
    service.update.mockResolvedValue({ id: '1', nom: 'Jane' });
    const out = await controller.update({} as any);
    expect(out).toEqual({ id: '1', nom: 'Jane' });
  });

  it('getMe retourne request.user', async () => {
    const req: any = { user: { id: 'me' } };
    const out = await controller.getMe(req as any);
    expect(out).toEqual({ id: 'me' });
  });

  it('getTechnicien appelle service.getTechnicien', async () => {
    service.getTechnicien.mockResolvedValue([{ id: 't1' }]);
    const out = await controller.getTechnicien();
    expect(out).toEqual([{ id: 't1' }]);
  });

  it('getClient appelle service.getClient', async () => {
    service.getClient.mockResolvedValue([{ id: 'c1' }]);
    const out = await controller.getClient();
    expect(out).toEqual([{ id: 'c1' }]);
  });

  it('logout appelle service.logout', async () => {
    const res: any = { clearCookie: jest.fn() };
    service.logout.mockResolvedValue({ message: 'Déconnexion réussie' });
    const out = await controller.logout(res);
    expect(out).toEqual({ message: 'Déconnexion réussie' });
  });
});
