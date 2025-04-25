import {
  Body,
  Controller, Delete,
  Get,
  Post, Put, Req,
  UseGuards,
} from '@nestjs/common';
import { ProduitService } from './produit.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../common/middleware/role.middleware';
import { Roles } from '../common/decorator/role.decorator';
import { CreateProduitDto } from './dto/createProduitDto';
import { Request } from 'express';


@Controller('produit')
export class ProduitController {
  constructor(private readonly produitService: ProduitService) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN', 'CLIENT', 'TECHNICIEN')
  @Get('/')
  getProduit() {
    return this.produitService.getProduit();
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Post('/create')
  createProduit(@Body() createProduitDto: CreateProduitDto) {
    return this.produitService.createProduit(createProduitDto);
  }
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Delete('/delete/:id')
  deleteProduit(@Req() request: Request) {
    return this.produitService.deleteProduit(request);
  }
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Put('/update/:id')
  updateProduit(@Req() request: Request) {
    return this.produitService.updateProduit(request);
  }
}
