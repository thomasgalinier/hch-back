import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import {
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

// Mock bcrypt
jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

describe('AuthService (unit)', () => {
  let service: AuthService;
  let prisma: {
    utilisateur: {
      findUnique: jest.Mock;
      create: jest.Mock;
      findMany: jest.Mock;
      delete: jest.Mock;
      update: jest.Mock;
    };
  };
  let jwt: { sign: jest.Mock };
  let config: { get: jest.Mock };

  beforeEach(async () => {
    prisma = {
      utilisateur: {
        findUnique: jest.fn(),
        create: jest.fn(),
        findMany: jest.fn(),
        delete: jest.fn(),
        update: jest.fn(),
      },
    } as any;
    jwt = { sign: jest.fn() } as any;
    config = {
      get: jest.fn((key: string) =>
        key === 'SECRET_KEY' ? 'secret' : 'development',
      ),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: prisma },
        { provide: JwtService, useValue: jwt },
        { provide: ConfigService, useValue: config },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  describe('signup', () => {
    it('crée un utilisateur et retourne token + user', async () => {
      const dto = {
        email: 'jane@example.com',
        password: 'Password#1',
        nom: 'Doe',
        prenom: 'Jane',
        telephone: '+33600000000',
        role: 'ADMIN',
      } as any;
      prisma.utilisateur.findUnique.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed');
      prisma.utilisateur.create.mockResolvedValue({
        id: 'u1',
        email: dto.email,
        nom: dto.nom,
        prenom: dto.prenom,
        telephone: dto.telephone,
      });
      jwt.sign.mockReturnValue('jwt-token');

      const res = await service.signup(dto);

      expect(prisma.utilisateur.findUnique).toHaveBeenCalledWith({
        where: { email: dto.email },
      });
      expect(bcrypt.hash).toHaveBeenCalledWith(dto.password, 10);
      expect(prisma.utilisateur.create).toHaveBeenCalled();
      expect(jwt.sign).toHaveBeenCalledWith(
        { email: dto.email, sub: 'u1' },
        expect.any(Object),
      );
      expect(res).toEqual({
        token: 'jwt-token',
        user: {
          id: 'u1',
          email: dto.email,
          nom: dto.nom,
          prenom: dto.prenom,
          telephone: dto.telephone,
        },
      });
    });

    it("lève ConflictException si l'email existe déjà", async () => {
      prisma.utilisateur.findUnique.mockResolvedValue({ id: 'u1' });
      await expect(
        service.signup({ email: 'dupe@example.com' } as any),
      ).rejects.toBeInstanceOf(ConflictException);
    });
  });

  describe('signin', () => {
    const mockRes = () => {
      const cookies: any[] = [];
      return {
        cookie: jest.fn((name, value, options) =>
          cookies.push({ name, value, options }),
        ),
      } as any;
    };

    it('retourne user et fixe un cookie JWT', async () => {
      const dto = { email: 'jane@example.com', password: 'Password#1' } as any;
      prisma.utilisateur.findUnique.mockResolvedValue({
        id: 'u1',
        email: dto.email,
        nom: 'Doe',
        prenom: 'Jane',
        telephone: '+33',
        password: 'hashed',
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      jwt.sign.mockReturnValue('jwt-token');
      (config.get as jest.Mock) = jest.fn((k: string) =>
        k === 'SECRET_KEY' ? 'secret' : 'development',
      ) as any;
      const res = mockRes();

      const out = await service.signin(dto, res);

      expect(prisma.utilisateur.findUnique).toHaveBeenCalledWith({
        where: { email: dto.email },
      });
      expect(bcrypt.compare).toHaveBeenCalledWith('Password#1', 'hashed');
      expect(res.cookie).toHaveBeenCalledWith(
        'token',
        'jwt-token',
        expect.objectContaining({
          httpOnly: true,
          secure: false,
          sameSite: 'lax',
        }),
      );
      expect(out).toEqual({
        user: {
          id: 'u1',
          email: dto.email,
          nom: 'Doe',
          prenom: 'Jane',
          telephone: '+33',
        },
      });
    });

    it("lève NotFoundException si l'utilisateur n'existe pas", async () => {
      prisma.utilisateur.findUnique.mockResolvedValue(null);
      const res = { cookie: jest.fn() } as any;
      await expect(
        service.signin({ email: 'x', password: 'y' } as any, res),
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it('lève UnauthorizedException si mot de passe incorrect', async () => {
      prisma.utilisateur.findUnique.mockResolvedValue({ password: 'hashed' });
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);
      const res = { cookie: jest.fn() } as any;
      await expect(
        service.signin({ email: 'x', password: 'y' } as any, res),
      ).rejects.toBeInstanceOf(UnauthorizedException);
    });
  });

  describe('getAll', () => {
    it('retourne la liste des utilisateurs', async () => {
      prisma.utilisateur.findMany.mockResolvedValue([{ id: '1' }]);
      const out = await service.getAll();
      expect(out).toEqual([{ id: '1' }]);
    });
  });

  describe('delete', () => {
    it('supprime un utilisateur si ADMIN/SUPER_ADMIN', async () => {
      prisma.utilisateur.delete.mockResolvedValue({ id: '1' });
      const req: any = { user: { role: 'ADMIN' }, params: { id: '1' } };
      const out = await service.delete(req);
      expect(prisma.utilisateur.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(out).toEqual({ id: '1' });
    });
  });

  describe('update', () => {
    it('met à jour un utilisateur si ADMIN/SUPER_ADMIN', async () => {
      prisma.utilisateur.update.mockResolvedValue({ id: '1', nom: 'Jane' });
      const req: any = {
        user: { role: 'SUPER_ADMIN' },
        params: { id: '1' },
        body: { nom: 'Jane' },
      };
      const out = await service.update(req);
      expect(prisma.utilisateur.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { nom: 'Jane' },
      });
      expect(out).toEqual({ id: '1', nom: 'Jane' });
    });
  });

  describe('getTechnicien / getClient', () => {
    it('retourne les techniciens', async () => {
      prisma.utilisateur.findMany.mockResolvedValue([
        { id: 't1', role: 'TECHNICIEN', zone: { id: 'z1' } },
      ]);
      const out = await service.getTechnicien();
      expect(prisma.utilisateur.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { role: 'TECHNICIEN' } }),
      );
      expect(out).toHaveLength(1);
    });

    it('retourne les clients', async () => {
      prisma.utilisateur.findMany.mockResolvedValue([
        { id: 'c1', role: 'CLIENT' },
      ]);
      const out = await service.getClient();
      expect(prisma.utilisateur.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { role: 'CLIENT' } }),
      );
      expect(out).toHaveLength(1);
    });
  });

  describe('logout', () => {
    it('clear le cookie avec flags en dev', () => {
      const res: any = { clearCookie: jest.fn() };
      (config.get as jest.Mock) = jest.fn((k: string) =>
        k === 'NODE_ENV' ? 'development' : 'secret',
      ) as any;
      const out = service.logout(res);
      expect(res.clearCookie).toHaveBeenCalledWith(
        'token',
        expect.objectContaining({
          httpOnly: true,
          secure: false,
          sameSite: 'lax',
        }),
      );
      expect(out).toEqual({ message: 'Déconnexion réussie' });
    });
  });
});
