import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateForfaitDto } from './dto/createForfaitDto';
import { Request } from "express";
@Injectable()
export class ForfaitService {
  constructor(private readonly prismaService: PrismaService) {}
  getForfait() {
    return this.prismaService.forfait.findMany();
  }

  createForfait(createForfaitDto: CreateForfaitDto) {
    function convertirEnMillisecondes(duree: string) {
      console.log(duree);
      // Vérifier si le format est correct (hh:mm)
      const regex = /^(\d{1,2}):(\d{2})$/;
      const match = duree.match(regex);

      if (!match) {
        throw new Error("Format invalide. Utilisez le format hh:mm.");
      }

      // Extraire les heures et les minutes
      const heures = parseInt(match[1], 10);
      const minutes = parseInt(match[2], 10);

      // Convertir en millisecondes
      const millisecondes = (heures * 60 * 60 * 1000) + (minutes * 60 * 1000);

      return millisecondes;
    }

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
    function convertirEnMillisecondes(duree: string) {
      console.log(duree);
      // Vérifier si le format est correct (hh:mm)
      const regex = /^(\d{1,2}):(\d{2})$/;
      const match = duree.match(regex);

      if (!match) {
        throw new Error("Format invalide. Utilisez le format hh:mm.");
      }

      // Extraire les heures et les minutes
      const heures = parseInt(match[1], 10);
      const minutes = parseInt(match[2], 10);

      // Convertir en millisecondes
      const millisecondes = (heures * 60 * 60 * 1000) + (minutes * 60 * 1000);

      return millisecondes;
    }


    const id = request.params.id;
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
