import { Body, Controller, Get, Post } from '@nestjs/common';
import { ModelService } from './model.service';
import { ModelDto } from './dto/modelDto';

@Controller('model')
export class ModelController {
  constructor(private readonly modelService: ModelService) {  }
  @Get('/')
  getModel() {
    return this.modelService.getModel()
  }
  @Post('/create')
  createModel(@Body() createModelDto: ModelDto) {
    return this.modelService.createModel(createModelDto)
  }
}
