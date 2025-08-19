import { Test, TestingModule } from '@nestjs/testing';
import { ForfaitController } from './forfait.controller';
import { ForfaitService } from './forfait.service';
import { CreateForfaitDto } from './dto/createForfaitDto';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../common/middleware/role.middleware';

// Mock du service de forfait
const mockForfaitService = {
  getForfait: jest.fn(),
  createForfait: jest.fn(),
  updateForfait: jest.fn(),
  deleteForfait: jest.fn(),
};

// Mock des gardes
const mockAuthGuard = { canActivate: jest.fn(() => true) };
const mockRolesGuard = { canActivate: jest.fn(() => true) };

describe('ForfaitController', () => {
  let controller: ForfaitController;
  let service: ForfaitService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ForfaitController],
      providers: [
        {
          provide: ForfaitService,
          useValue: mockForfaitService,
        },
      ],
    })
      .overrideGuard(AuthGuard('jwt'))
      .useValue(mockAuthGuard)
      .overrideGuard(RolesGuard)
      .useValue(mockRolesGuard)
      .compile();

    controller = module.get<ForfaitController>(ForfaitController);
    service = module.get<ForfaitService>(ForfaitService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getForfait', () => {
    it('should return all forfaits', async () => {
      const expectedResult = [
        { id: '1', titre: 'Forfait 1', prix: 50, description: 'Description 1' },
        {
          id: '2',
          titre: 'Forfait 2',
          prix: 100,
          description: 'Description 2',
        },
      ];
      mockForfaitService.getForfait.mockResolvedValue(expectedResult);

      const result = await controller.getForfait();

      expect(result).toBe(expectedResult);
      expect(mockForfaitService.getForfait).toHaveBeenCalledTimes(1);
    });
  });

  describe('createForfait', () => {
    it('should create a new forfait', async () => {
      const createForfaitDto: CreateForfaitDto = {
        titre: 'Nouveau Forfait',
        prix: '75.50',
        description: 'Description du nouveau forfait',
        type: 'STANDARD',
        categorie_velo: 'VTT',
        duree: '2h30',
      };

      const createdForfait = {
        id: '3',
        titre: 'Nouveau Forfait',
        prix: 75.5,
        description: 'Description du nouveau forfait',
        type: 'STANDARD',
        categorie_velo: 'VTT',
        duree: '2h30',
        formatted_duree: '2h30_converted',
      };

      mockForfaitService.createForfait.mockResolvedValue(createdForfait);

      const result = await controller.createForfait(createForfaitDto);

      expect(result).toBe(createdForfait);
      expect(mockForfaitService.createForfait).toHaveBeenCalledWith(
        createForfaitDto,
      );
    });
  });

  describe('updateForfait', () => {
    it('should update an existing forfait', async () => {
      const request = {
        params: {
          id: '1',
        },
        body: {
          forfait: {
            titre: 'Forfait Modifié',
            prix: '120.75',
            description: 'Description modifiée',
            type: 'PREMIUM',
            categorie_velo: 'ROUTE',
            duree: '3h45',
          },
        },
      } as unknown as Request;

      const updatedForfait = {
        id: '1',
        titre: 'Forfait Modifié',
        prix: 120.75,
        description: 'Description modifiée',
        type: 'PREMIUM',
        categorie_velo: 'ROUTE',
        duree: '3h45',
        formatted_duree: '3h45_converted',
      };

      mockForfaitService.updateForfait.mockResolvedValue(updatedForfait);

      const result = await controller.updateForfait(request);

      expect(result).toBe(updatedForfait);
      expect(mockForfaitService.updateForfait).toHaveBeenCalledWith(request);
    });
  });

  describe('deleteForfait', () => {
    it('should delete a forfait', async () => {
      const request = {
        params: {
          id: '2',
        },
      } as unknown as Request;

      const deletedForfait = {
        id: '2',
        titre: 'Forfait Supprimé',
        prix: 85,
        description: 'Description supprimée',
      };

      mockForfaitService.deleteForfait.mockResolvedValue(deletedForfait);

      const result = await controller.deleteForfait(request);

      expect(result).toBe(deletedForfait);
      expect(mockForfaitService.deleteForfait).toHaveBeenCalledWith(request);
    });
  });
});
