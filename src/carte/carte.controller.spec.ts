import { Test, TestingModule } from '@nestjs/testing';
import { CarteController } from './carte.controller';
import { CarteService } from './carte.service';
import { CreateZoneDto } from './dto/createZoneDto';

describe('CarteController', () => {
  let controller: CarteController;
  let service: CarteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CarteController],
      providers: [
        {
          provide: CarteService,
          useValue: {
            getCarte: jest.fn().mockResolvedValue(['zone1', 'zone2']),
            createZone: jest.fn().mockResolvedValue({ id: '1', nom: 'zone' }),
            updataZone: jest.fn().mockResolvedValue({ id: '1', nom: 'updated' }),
            deleteZone: jest.fn().mockResolvedValue({ id: '1' }),
          },
        },
      ],
    }).compile();
    controller = module.get<CarteController>(CarteController);
    service = module.get<CarteService>(CarteService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('getCarte doit appeler le service', async () => {
    const req: any = {};
    const result = await controller.getCarte(req);
    expect(result).toEqual(['zone1', 'zone2']);
    expect(service.getCarte).toHaveBeenCalledWith(req);
  });

  it('createZone doit appeler le service', async () => {
    const dto: CreateZoneDto = { nom: 'zone', polygone: {}, idTechnicien: '1', color: '#fff' } as any;
    const result = await controller.createZone(dto);
    expect(result).toEqual({ id: '1', nom: 'zone' });
    expect(service.createZone).toHaveBeenCalledWith(dto);
  });

  it('updateZone doit appeler le service', async () => {
    const req: any = { params: { id: '1' }, body: { zone: { nom: 'updated' } } };
    const result = await controller.updateZone(req);
    expect(result).toEqual({ id: '1', nom: 'updated' });
    expect(service.updataZone).toHaveBeenCalledWith(req);
  });

  it('deleteZone doit appeler le service', async () => {
    const req: any = { params: { id: '1' } };
    const result = await controller.deleteZone(req);
    expect(result).toEqual({ id: '1' });
    expect(service.deleteZone).toHaveBeenCalledWith(req);
  });
});
