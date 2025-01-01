import { Body, Controller, Delete, Get, Post, Put, Req } from '@nestjs/common';
import { PlaningService } from './planing.service';
import { ModelDto } from '../model/dto/modelDto';
import { PlanningDto } from './dto/PlanningDto';
import { Request } from 'express';


@Controller('planning')
export class PlaningController {
  constructor(private readonly planingService: PlaningService) {
  }
  @Get('/')
  getPlanning() {
    return this.planingService.getPlaning()
  }
  @Get('/technicien/:id')
  getPlanningByTechnicien(@Req() request: Request) {
    return this.planingService.getPlaningByTechnicien(request)
  }
  @Put('/update/:id')
  updatePlanning(@Req() request: Request) {
    return this.planingService.updatePlanning(request)
  }
  @Post('/create')
  createPlanning(@Body() createPlanningDto: PlanningDto) {
    return this.planingService.createPlaning(createPlanningDto)
  }
  @Delete('delete/:id')
  deletePlanning(@Req() request: Request) {
    return this.planingService.deletePlanning(request)
  }
}