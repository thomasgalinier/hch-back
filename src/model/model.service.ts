import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ModelDto } from './dto/modelDto';

@Injectable()
export class ModelService {
  constructor(private readonly prismaService: PrismaService) {}

  getModel() {
    return this.prismaService.modele.findMany();
  }

  createModel(createModelDto: ModelDto) {
    const {nom, duree } = createModelDto;
    return this.prismaService.modele.create({
      data: {
        nom,
        duree
      }
    });
  }
}
