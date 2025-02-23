import { Controller, Get, UseGuards } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ProduitService } from './produit.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../common/middleware/role.middleware';
import { Roles } from '../common/decorator/role.decorator';

@Controller('produit')
export class ProduitController {
  constructor(private readonly produitService: ProduitService) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN','CLIENT','TECHNICIEN')
  @Get('/')
  getProduit() {
    return this.produitService.getProduit();
  }
  }

