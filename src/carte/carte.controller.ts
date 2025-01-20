import { Body, Controller, Delete, Get, Post, Put, Req, UseGuards } from "@nestjs/common";
import { CarteService } from "./carte.service";
import { CreateZoneDto } from "./dto/createZoneDto";
import { Request } from "express";
import { AuthGuard } from "@nestjs/passport";
import { RolesGuard } from "../common/middleware/role.middleware";
import { Roles } from "../common/decorator/role.decorator";
@Controller('carte')
export class CarteController {
  constructor(private readonly carteService: CarteService) {
  }
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Get('/')
  getCarte(@Req() request: Request) {
    return this.carteService.getCarte(request)
  }

  @Post('create')
  createZone(@Body() createZoneDto: CreateZoneDto) {
    return this.carteService.createZone(createZoneDto)
  }

  @Put('update/:id')
  updateZone(@Req() request: Request) {
    return this.carteService.updataZone(request)
  }

  @Delete('delete/:id')
  deleteZone(@Req() request: Request) {
    return this.carteService.deleteZone(request)
  }
}