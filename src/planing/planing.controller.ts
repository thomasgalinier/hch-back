import { Body, Controller, Get, Post, Req } from '@nestjs/common';
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
  @Post('/create')
  createPlanning(@Body() createPlanningDto: PlanningDto) {
    return this.planingService.createPlaning(createPlanningDto)
  }
}