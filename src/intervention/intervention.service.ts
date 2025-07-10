import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInterventionDto } from './dto/createInterventionDto';

@Injectable()
export class InterventionService {
  constructor(private readonly prismaService: PrismaService) {
  }
  getInterventions() {
    return this.prismaService.intervention.findMany();
  }

  async createIntervention(createInterventionDto: CreateInterventionDto) {
    return this.prismaService.intervention.create({
      data: createInterventionDto,
    });
  }

  async getInterventionById(id: string) {
    return this.prismaService.intervention.findUnique({ where: { id } });
  }

  async updateIntervention(id: string, updateDto: CreateInterventionDto) {
    return this.prismaService.intervention.update({
      where: { id },
      data: updateDto,
    });
  }

  async deleteIntervention(id: string) {
    return this.prismaService.intervention.delete({ where: { id } });
  }
}
