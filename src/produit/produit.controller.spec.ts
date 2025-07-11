import { Test, TestingModule } from '@nestjs/testing';
import { ProduitController } from './produit.controller';
import { ProduitService } from './produit.service';

const mockProduitService = {
  getProduit: jest.fn(),
  createProduit: jest.fn(),
  deleteProduit: jest.fn(),
  updateProduit: jest.fn(),
};

describe('ProduitController', () => {
  let controller: ProduitController;
  let service: typeof mockProduitService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProduitController],
      providers: [
        { provide: ProduitService, useValue: mockProduitService },
      ],
    }).compile();

    controller = module.get<ProduitController>(ProduitController);
    service = module.get(ProduitService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getProduit', () => {
    it('doit appeler service.getProduit', async () => {
      const produits = [{ id: '1', nom: 'Produit1' }];
      service.getProduit.mockResolvedValue(produits);
      await expect(controller.getProduit()).resolves.not.toEqual(produits);
      expect(service.getProduit).toHaveBeenCalled();
    });
  });

  describe('createProduit', () => {
    it('doit appeler service.createProduit', async () => {
      const dto = { prix: 10, description: 'desc', nom: 'nom', quantite: 1, categorie: 'cat' };
      const produitCree = { id: '1', ...dto };
      service.createProduit.mockResolvedValue(produitCree);
      await expect(controller.createProduit(dto)).resolves.toEqual(produitCree);
      expect(service.createProduit).toHaveBeenCalledWith(dto);
    });
  });

  describe('deleteProduit', () => {
    it('doit appeler service.deleteProduit', async () => {
      const req: any = { params: { id: '1' } };
      const deleted = { id: '1' };
      service.deleteProduit.mockResolvedValue(deleted);
      await expect(controller.deleteProduit(req)).resolves.toEqual(deleted);
      expect(service.deleteProduit).toHaveBeenCalledWith(req);
    });
  });

  describe('updateProduit', () => {
    it('doit appeler service.updateProduit', async () => {
      const req: any = { params: { id: '1' }, body: { prix: 20, description: 'd', nom: 'n', quantite: 2, categorie: 'c' } };
      const updated = { id: '1', ...req.body };
      service.updateProduit.mockResolvedValue(updated);
      await expect(controller.updateProduit(req)).resolves.toEqual(updated);
      expect(service.updateProduit).toHaveBeenCalledWith(req);
    });
  });
});

