import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProduitDto } from './dto/createProduitDto';
import { Request } from 'express';

@Injectable()
export class ProduitService {
  constructor(private readonly prismaService: PrismaService) {}
  getProduit() {
    return this.prismaService.produit.findMany();
  }

  createProduit(createProduitDto: CreateProduitDto) {
    console.log(createProduitDto);
    const { prix, description, nom, quantite, categorie } = createProduitDto;

    return this.prismaService.produit.create({
      data: {
        prix,
        description,
        nom,
        quantite,
        categorie,
      },
    });
  }

  deleteProduit(request: Request) {
    const id = request.params.id;
    return this.prismaService.produit.delete({
      where: { id },
    });
  }

  updateProduit(request: Request) {
    const id = request.params.id;
    const { prix, description, nom, quantite, categorie } = request.body;
    return this.prismaService.produit.update({
      where: { id },
      data: {
        prix,
        description,
        nom,
        quantite,
        categorie,
      },
    })

  }
}
