import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Req, UseGuards } from "@nestjs/common";
import { CarteService } from "./carte.service";
import { CreateZoneDto } from "./dto/createZoneDto";
import { Request } from "express";
import { AuthGuard } from "@nestjs/passport";
import { RolesGuard } from "../common/middleware/role.middleware";
import { Roles } from "../common/decorator/role.decorator";
import { AssignTechnicianDto } from "./dto/assign-technician.dto";
@Controller('carte')
export class CarteController {
  constructor(private readonly carteService: CarteService) {
  }
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Get('/')
  getCarte() {
    return this.carteService.getCarte()
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Post('create')
  createZone(@Body() createZoneDto: CreateZoneDto) {
    return this.carteService.createZone(createZoneDto)
  }
  
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Put('update/:id')
  updateZone(@Req() request: Request) {
    return this.carteService.updataZone(request)
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Patch(':id/assign-technician')
  assignTechnicianToZone(@Param('id') zoneId: string, @Body() dto: AssignTechnicianDto) {
    return this.carteService.assignTechnicianToZone(zoneId, dto);

  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Delete('delete/:id')
  deleteZone(@Req() request: Request) {
    return this.carteService.deleteZone(request)
  }
}