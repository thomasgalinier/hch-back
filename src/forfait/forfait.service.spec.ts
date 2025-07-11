import { Test, TestingModule } from '@nestjs/testing';
import { ForfaitService } from './forfait.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateForfaitDto } from './dto/createForfaitDto';
import { Request } from 'express';
import { convertirEnMillisecondes } from '../utils/duree.util';

// Mock pour le service Prisma
const mockPrismaService = {
  forfait: {
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

// Mock pour l'utilitaire de conversion de durée
jest.mock('../utils/duree.util', () => ({
  convertirEnMillisecondes: jest.fn().mockImplementation((duree) => `${duree}_converted`),
}));

describe('ForfaitService', () => {
  let service: ForfaitService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ForfaitService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<ForfaitService>(ForfaitService);
    prismaService = module.get<PrismaService>(PrismaService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getForfait', () => {
    it('should return all forfaits', async () => {
      const expectedForfaits = [
        { id: '1', titre: 'Forfait 1', prix: 50, description: 'Test description' },
        { id: '2', titre: 'Forfait 2', prix: 100, description: 'Test description 2' },
      ];

      mockPrismaService.forfait.findMany.mockResolvedValue(expectedForfaits);

      const result = await service.getForfait();

      expect(result).toEqual(expectedForfaits);
      expect(mockPrismaService.forfait.findMany).toHaveBeenCalledTimes(1);
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

      mockPrismaService.forfait.create.mockResolvedValue(createdForfait);

      const result = await service.createForfait(createForfaitDto);

      expect(result).toEqual(createdForfait);
      expect(mockPrismaService.forfait.create).toHaveBeenCalledWith({
        data: {
          titre: 'Nouveau Forfait',
          prix: 75.5,
          description: 'Description du nouveau forfait',
          type: 'STANDARD',
          categorie_velo: 'VTT',
          duree: '2h30',
          formatted_duree: '2h30_converted',
        },
      });
      expect(convertirEnMillisecondes).toHaveBeenCalledWith('2h30');
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

      mockPrismaService.forfait.update.mockResolvedValue(updatedForfait);

      const result = await service.updateForfait(request);

      expect(result).toEqual(updatedForfait);
      expect(mockPrismaService.forfait.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: {
          ...request.body.forfait,
          prix: 120.75,
          formatted_duree: '3h45_converted',
        },
      });
      expect(convertirEnMillisecondes).toHaveBeenCalledWith('3h45');
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

      mockPrismaService.forfait.delete.mockResolvedValue(deletedForfait);

      const result = await service.deleteForfait(request);

      expect(result).toEqual(deletedForfait);
      expect(mockPrismaService.forfait.delete).toHaveBeenCalledWith({
        where: { id: '2' },
      });
    });
  });
});
