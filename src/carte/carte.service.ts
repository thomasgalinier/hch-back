import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { ConfigService } from "@nestjs/config";
import { CreateZoneDto } from "./dto/createZoneDto";
import { Request } from "express";

@Injectable()
export class CarteService {
  constructor(private readonly prismaService: PrismaService, private  readonly configService: ConfigService) {}

  getCarte(request: Request) {
    return this.prismaService.zone.findMany();
  }

  createZone(createZoneDto: CreateZoneDto) {
    const {nom, polygone, idTechnicien, color} = createZoneDto;
    return this.prismaService.zone.create({
      data: {
        nom,
        polygone,
        id_technicien: idTechnicien,
        color
      }
    });
  }

  updataZone(request: Request) {
    const id = request.params.id;
    return this.prismaService.zone.update({
      where: {id},
      data: request.body
    });
  }

  deleteZone(request:Request) {
    const id = request.params.id;
    return this.prismaService.zone.delete({
      where: {id}
  });
  }
}