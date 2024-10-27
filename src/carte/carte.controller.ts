import { Body, Controller, Delete, Get, Post, Put, Req } from "@nestjs/common";
import { CarteService } from "./carte.service";
import { CreateZoneDto } from "./dto/createZoneDto";
import { Request } from "express";
@Controller('carte')
export class CarteController {
  constructor(private readonly carteService: CarteService) {
  }

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