import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ModelDto } from '../model/dto/modelDto';
import { PlanningDto } from './dto/PlanningDto';
import { Request } from 'express';

@Injectable()
export class PlaningService {
  constructor(private prismaService: PrismaService) {}

  getPlaning() {
    return this.prismaService.planning.findMany();
  }

  createPlaning(createPlanningDto: PlanningDto) {
    const { id_technicien, id_model, fin, debut } = createPlanningDto;

    return this.prismaService.planning.create({
      data: {

        id_technicien,
        id_model,
        debut,
        fin,
      },
    });
  }


  getPlaningByTechnicien(request: Request) {
    const id_technicien = request.params.id;

    return this.prismaService.planning.findMany({
      where: {
        id_technicien: id_technicien,
      },
    });
  }

  updatePlanning(request: Request) {
    const id = request.params.id;
    const { id_technicien, id_model, fin, debut } = request.body;

    return this.prismaService.planning.update({
      where: {
        id: id,
      },
      data: {
        id_technicien,
        id_model,
        fin,
        debut,
      },
  });
}

  deletePlanning(request: Request) {
    const id = request.params.id;
    console.log(id);
    return this.prismaService.planning.delete({
      where: {id},
    });
  }
}
