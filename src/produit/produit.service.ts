import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProduitService {
  constructor(private readonly prismaService: PrismaService) {
  }
  getProduit() {
    return this.prismaService.produit.findMany();
  }
  
}
