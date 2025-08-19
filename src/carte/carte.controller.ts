import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CarteService } from './carte.service';
import { CreateZoneDto } from './dto/createZoneDto';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../common/middleware/role.middleware';
import { Roles } from '../common/decorator/role.decorator';
import { AssignTechnicianDto } from './dto/assign-technician.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ZoneEntity } from './entities/zone.entity';
import { UpdateZoneDto } from './dto/update-zone.dto';
@ApiTags('carte')
@ApiBearerAuth()
@ApiCookieAuth('token')
@Controller('carte')
export class CarteController {
  constructor(private readonly carteService: CarteService) {}
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Get('/')
  @ApiOperation({
    summary: 'Lister les zones',
    description:
      'Retourne la liste des zones avec, le cas échéant, le technicien assigné.',
  })
  @ApiOkResponse({
    description: 'Liste des zones',
    type: ZoneEntity,
    isArray: true,
  })
  @ApiUnauthorizedResponse({ description: 'Non authentifié' })
  @ApiForbiddenResponse({ description: 'Accès interdit' })
  getCarte() {
    return this.carteService.getCarte();
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Post('create')
  @ApiOperation({ summary: 'Créer une zone' })
  @ApiCreatedResponse({ description: 'Zone créée', type: ZoneEntity })
  @ApiBody({ type: CreateZoneDto })
  @ApiUnauthorizedResponse({ description: 'Non authentifié' })
  @ApiForbiddenResponse({ description: 'Accès interdit' })
  createZone(@Body() createZoneDto: CreateZoneDto) {
    return this.carteService.createZone(createZoneDto);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Put('update/:id')
  @ApiOperation({ summary: 'Mettre à jour une zone' })
  @ApiParam({ name: 'id', description: 'Identifiant de la zone' })
  @ApiBody({ type: UpdateZoneDto })
  @ApiOkResponse({ description: 'Zone mise à jour', type: ZoneEntity })
  @ApiUnauthorizedResponse({ description: 'Non authentifié' })
  @ApiForbiddenResponse({ description: 'Accès interdit' })
  updateZone(@Req() request: Request) {
    return this.carteService.updataZone(request);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Patch(':id/assign-technician')
  @ApiOperation({ summary: 'Assigner un technicien à une zone' })
  @ApiParam({ name: 'id', description: 'Identifiant de la zone' })
  @ApiBody({ type: AssignTechnicianDto })
  @ApiOkResponse({
    description: 'Zone mise à jour avec technicien assigné',
    type: ZoneEntity,
  })
  @ApiUnauthorizedResponse({ description: 'Non authentifié' })
  @ApiForbiddenResponse({ description: 'Accès interdit' })
  assignTechnicianToZone(
    @Param('id') zoneId: string,
    @Body() dto: AssignTechnicianDto,
  ) {
    return this.carteService.assignTechnicianToZone(zoneId, dto);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Delete('delete/:id')
  @ApiOperation({ summary: 'Supprimer une zone' })
  @ApiParam({ name: 'id', description: 'Identifiant de la zone' })
  @ApiOkResponse({ description: 'Zone supprimée', type: ZoneEntity })
  @ApiConflictResponse({
    description:
      'Impossible de supprimer la zone car des interventions y sont rattachées',
  })
  @ApiUnauthorizedResponse({ description: 'Non authentifié' })
  @ApiForbiddenResponse({ description: 'Accès interdit' })
  deleteZone(@Req() request: Request) {
    return this.carteService.deleteZone(request);
  }
}
