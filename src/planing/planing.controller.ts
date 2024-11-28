import { Body, Controller, Get, Post } from '@nestjs/common';
import { PlaningService } from './planing.service';
import { ModelDto } from '../model/dto/modelDto';

@Controller('planing')
export class PlaningController {
  constructor(private readonly planingService: PlaningService) {
  }
  @Get('/')
  getPlaning() {
    return this.planingService.getPlaning()
  }
  @Post('/create')
  createPlaning() {
    return this.planingService.createPlaning()
  }
}