import { Body, Controller, Get, Post, Put, Req } from "@nestjs/common";
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
  @Post('/createZone')
  createZone(@Body() createZoneDto: CreateZoneDto) {
    return this.carteService.createZone(createZoneDto)
  }
  @Put('/updateZone/:id')
  updateZone(@Req() request: Request) {
    return this.carteService.updataZone(request)
  }

}