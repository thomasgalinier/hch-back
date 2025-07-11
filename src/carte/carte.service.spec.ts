import { Test, TestingModule } from '@nestjs/testing';
import { CarteService } from './carte.service';
import { PrismaService } from '../prisma/prisma.service';

describe('CarteService', () => {
  let service: CarteService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CarteService,
        {
          provide: PrismaService,
          useValue: {
            zone: {
              findMany: jest.fn().mockResolvedValue(['zone1', 'zone2']),
              create: jest.fn().mockResolvedValue({ id: '1', nom: 'zone' }),
              update: jest.fn().mockResolvedValue({ id: '1', nom: 'updated' }),
              delete: jest.fn().mockResolvedValue({ id: '1' }),
            },
          },
        },
      ],
    }).compile();
    service = module.get<CarteService>(CarteService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('getCarte doit retourner les zones', async () => {
    const req: any = {};
    const result = await service.getCarte(req);
    expect(result).toEqual(['zone1', 'zone2']);
    expect(prismaService.zone.findMany).toHaveBeenCalled();
  });

  it('createZone doit créer une zone', async () => {
    const dto = { nom: 'zone', polygone: {}, idTechnicien: '1', color: '#fff' };
    const result = await service.createZone(dto as any);
    expect(result).toEqual({ id: '1', nom: 'zone' });
    expect(prismaService.zone.create).toHaveBeenCalled();
  });

  it('updataZone doit mettre à jour une zone', async () => {
    const req: any = { params: { id: '1' }, body: { zone: { nom: 'updated' } } };
    const result = await service.updataZone(req);
    expect(result).toEqual({ id: '1', nom: 'updated' });
    expect(prismaService.zone.update).toHaveBeenCalledWith({ where: { id: '1' }, data: { nom: 'updated' } });
  });

  it('deleteZone doit supprimer une zone', async () => {
    const req: any = { params: { id: '1' } };
    const result = await service.deleteZone(req);
    expect(result).toEqual({ id: '1' });
    expect(prismaService.zone.delete).toHaveBeenCalledWith({ where: { id: '1' } });
  });
});
