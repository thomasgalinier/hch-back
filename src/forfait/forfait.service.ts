import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ForfaitService {
  constructor(private readonly prismaService: PrismaService) {}
  getForfait() {
    return this.prismaService.forfait.findMany();
  }
}
