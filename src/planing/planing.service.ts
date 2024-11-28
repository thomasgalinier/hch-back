import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ModelDto } from '../model/dto/modelDto';

@Injectable()
export class PlaningService {
  constructor(private prismaService: PrismaService) {}

  getPlaning() {
    return this.prismaService.planning.findMany();
  }

  createPlaning() {

  }
}