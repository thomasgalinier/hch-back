import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateForfaitDto } from './dto/createForfaitDto';
import { Request } from "express";
import { convertirEnMillisecondes } from '../utils/duree.util';

@Injectable()
export class ForfaitService {
  constructor(private readonly prismaService: PrismaService) { }
  getForfait() {
    return this.prismaService.forfait.findMany();
  }

  createForfait(createForfaitDto: CreateForfaitDto) {


    const { titre, prix, description, type, categorie_velo, duree } = createForfaitDto;
    const formattedDuree = convertirEnMillisecondes(duree);
    return this.prismaService.forfait.create({
      data: {
        titre,
        prix: parseFloat(prix),
        description,
        type,
        categorie_velo,
        duree: duree,
        formatted_duree: formattedDuree,
      },
    });
  }

  updateForfait(request: Request) {
    const id = request.params.id;
    console.log('toto',request.body.forfait);
    const { duree, prix } = request.body.forfait;
    const dureeFormatted = convertirEnMillisecondes(duree);

    return this.prismaService.forfait.update({
      where: { id },
      data: {
        ...request.body.forfait,
        prix: parseFloat(prix),
        formatted_duree: dureeFormatted,
      }
    });
  }

  deleteForfait(request: Request) {
    const id = request.params.id;
    return this.prismaService.forfait.delete({
      where: { id },
    });
  }
}
