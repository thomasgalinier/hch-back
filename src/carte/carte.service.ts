import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { ConfigService } from "@nestjs/config";
import { CreateZoneDto } from "./dto/createZoneDto";
import { Request } from "express";
import { AssignTechnicianDto } from "./dto/assign-technician.dto";

@Injectable()
export class CarteService {
  async assignTechnicianToZone(zoneId: string, dto: AssignTechnicianDto) {
  return this.prismaService.zone.update({
    where: { id: zoneId },
    data: {
      technicien_id: dto.technicienId,
    },
    include: {
      technicien: true,
    },
  });
}
  constructor(private readonly prismaService: PrismaService) {}

  getCarte() {
    return this.prismaService.zone.findMany({
      include: {
        technicien: {
          select: { id: true, nom: true, prenom: true, email:true },
        }
      }
    });
  }

  createZone(createZoneDto: CreateZoneDto) {
    const {nom, polygone, color} = createZoneDto;
    return this.prismaService.zone.create({
      data: {
        nom,
        polygone,
        color
      }
    });
  }

  updataZone(request: Request) {
    const id = request.params.id;
    console.log(request.body);
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