import { Test, TestingModule } from '@nestjs/testing';
import { ProduitService } from './produit.service';
import { PrismaService } from '../prisma/prisma.service';

const mockPrismaService = {
  produit: {
    findMany: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
    update: jest.fn(),
  },
};

describe('ProduitService', () => {
  let service: ProduitService;
  let prisma: typeof mockPrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProduitService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<ProduitService>(ProduitService);
    prisma = module.get(PrismaService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getProduit', () => {
    it('doit retourner la liste des produits', async () => {
      const produits = [{ id: '1', nom: 'Produit1' }];
      prisma.produit.findMany.mockResolvedValue(produits);
      await expect(service.getProduit()).resolves.toEqual(produits);
      expect(prisma.produit.findMany).toHaveBeenCalled();
    });
  });

  describe('createProduit', () => {
    it('doit créer un produit', async () => {
      const dto = { prix: 10, description: 'desc', nom: 'nom', quantite: 1, categorie: 'cat' };
      const produitCree = { id: '1', ...dto };
      prisma.produit.create.mockResolvedValue(produitCree);
      await expect(service.createProduit(dto)).resolves.toEqual(produitCree);
      expect(prisma.produit.create).toHaveBeenCalledWith({ data: dto });
    });
  });

  describe('deleteProduit', () => {
    it('doit supprimer un produit', async () => {
      const req: any = { params: { id: '1' } };
      const deleted = { id: '1' };
      prisma.produit.delete.mockResolvedValue(deleted);
      await expect(service.deleteProduit(req)).resolves.toEqual(deleted);
      expect(prisma.produit.delete).toHaveBeenCalledWith({ where: { id: '1' } });
    });
  });

  describe('updateProduit', () => {
    it('doit mettre à jour un produit', async () => {
      const req: any = { params: { id: '1' }, body: { prix: 20, description: 'd', nom: 'n', quantite: 2, categorie: 'c' } };
      const updated = { id: '1', ...req.body };
      prisma.produit.update.mockResolvedValue(updated);
      await expect(service.updateProduit(req)).resolves.toEqual(updated);
      expect(prisma.produit.update).toHaveBeenCalledWith({ where: { id: '1' }, data: req.body });
    });
  });
});

