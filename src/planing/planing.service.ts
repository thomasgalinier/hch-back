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
    const { id_technicien, id_model, dateTime } = createPlanningDto;

    return this.prismaService.planning
      .create({
        data: {
          id_technicien,
          id_model,
          dateTime
        },
      })
  }



  getPlaningByTechnicien(request: Request) {
    const id = request.params.id;
    return this.prismaService.planning.findMany({
      where: {
        id_technicien: id,
      },
    });
  }
}