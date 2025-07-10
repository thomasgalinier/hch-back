import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { InterventionService } from './intervention.service';
import { CreateInterventionDto } from './dto/createInterventionDto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../common/middleware/role.middleware';
import { Roles } from '../common/decorator/role.decorator';

@Controller('intervention')
export class InterventionController {
  constructor(private readonly interventionService: InterventionService) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN', 'TECHNICIEN', 'CLIENT')
  @Get('/')
  getInterventions() {
    return this.interventionService.getInterventions();
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN', 'TECHNICIEN')
  @Post('/create')
  createIntervention(@Body() createInterventionDto: CreateInterventionDto) {
    return this.interventionService.createIntervention(createInterventionDto);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN', 'TECHNICIEN', 'CLIENT')
  @Get('/:id')
  getInterventionById(@Param('id') id: string) {
    return this.interventionService.getInterventionById(id);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN', 'TECHNICIEN')
  @Put('/:id')
  updateIntervention(@Param('id') id: string, @Body() updateDto: CreateInterventionDto) {
    return this.interventionService.updateIntervention(id, updateDto);
  }
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN', 'TECHNICIEN')
  @Delete('/:id')
  deleteIntervention(@Param('id') id: string) {
    return this.interventionService.deleteIntervention(id);
  }
}
