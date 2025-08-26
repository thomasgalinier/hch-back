import {
  Controller,
  Post,
  Body,
  Get,
  Patch,
  Param,
  UseGuards,
  Delete,
  Query,
  Req,
  ForbiddenException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { InterventionService } from './intervention.service';
import { UpdateInterventionDto } from './dto/updateIntervention.dto';
import { RolesGuard } from '../common/middleware/role.middleware';
import { AuthGuard } from '@nestjs/passport';
import { InterventionResponseDto } from './dto/response.dto';
import {
  BulkCreateEmptyInterventionsDto,
  BulkCreateEmptyInterventionsResponseDto,
} from './dto/bulkCreateEmptyInterventions.dto';
import {
  DeleteInterventionsRangeDto,
  DeleteInterventionsRangeResponseDto,
} from './dto/deleteInterventionsRange.dto';
import { DeleteInterventionResponseDto } from './dto/deleteIntervention.dto';
import { Roles } from '../common/decorator/role.decorator';
import { ListUnplannedInterventionsQueryDto } from './dto/listUnplannedInterventions.dto';
import { ListPlannedInterventionsQueryDto } from './dto/listPlannedInterventionsQuery.dto';
import {
  ListClientInterventionsQueryDto,
  PaginatedInterventionsResponseDto,
} from './dto/listClientInterventions.dto';
import { UserType } from 'schema';

@ApiTags('intervention')
@Controller('intervention')
export class InterventionController {
  constructor(private readonly interventionService: InterventionService) {}

  /**
   * Création en masse de créneaux d'interventions vides (UNPLANNED) de 1h par défaut
   * pour un technicien et une zone, sur une période fournie (journées entières).
   */
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Post('bulk-empty')
  @ApiOperation({
    summary: 'Créer des interventions vides sur une plage de dates',
  })
  @ApiBody({ type: BulkCreateEmptyInterventionsDto })
  @ApiResponse({
    status: 201,
    description: 'Créneaux créés',
    type: BulkCreateEmptyInterventionsResponseDto,
  })
  async bulkCreateEmpty(
    @Body() body: BulkCreateEmptyInterventionsDto,
  ): Promise<BulkCreateEmptyInterventionsResponseDto> {
    return this.interventionService.bulkCreateEmptyInterventions(body);
  }

  /**
   * Récupère toutes les interventions d'un technicien
   */
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN', 'TECHNICIEN')
  @Get('technicien/:id')
  @ApiOperation({ summary: "Lister les interventions d'un technicien" })
  @ApiParam({ name: 'id', description: 'ID du technicien' })
  @ApiResponse({
    status: 200,
    description: 'Liste des interventions',
    type: [InterventionResponseDto],
  })
  async findAllByTechnicien(
    @Param('id') id: string,
  ): Promise<InterventionResponseDto[]> {
    return this.interventionService.findAllByTechnicien(id);
  }

  /**
   * Supprime toutes les interventions d'un technicien sur une plage de jours (inclusifs).
   */
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Delete('technicien/:id')
  @ApiOperation({
    summary:
      "Supprimer les interventions d'un technicien sur une plage de dates",
  })
  @ApiParam({ name: 'id', description: 'ID du technicien' })
  @ApiBody({ type: DeleteInterventionsRangeDto })
  @ApiResponse({
    status: 200,
    description: 'Résultat de la suppression',
    type: DeleteInterventionsRangeResponseDto,
  })
  async deleteByTechnicienAndRange(
    @Param('id') id: string,
    @Body() body: DeleteInterventionsRangeDto,
  ): Promise<DeleteInterventionsRangeResponseDto> {
    return this.interventionService.deleteInterventionsByTechnicienAndDateRange(
      id,
      body,
    );
  }

  /**
   * Met à jour une intervention
   */
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN', 'TECHNICIEN', 'CLIENT')
  @Patch(':id')
  @ApiOperation({ summary: 'Mettre à jour une intervention' })
  @ApiParam({ name: 'id', description: "ID de l'intervention" })
  @ApiBody({ type: UpdateInterventionDto })
  @ApiResponse({
    status: 200,
    description: 'Intervention mise à jour',
    type: InterventionResponseDto,
  })
  async update(
    @Param('id') id: string,
    @Body() body: UpdateInterventionDto,
  ): Promise<InterventionResponseDto> {
    return this.interventionService.updateIntervention(id, body);
  }

  /**
   * Supprimer une intervention par ID
   */
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer une intervention' })
  @ApiParam({ name: 'id', description: "ID de l'intervention" })
  @ApiResponse({
    status: 200,
    description: 'Intervention supprimée',
    type: DeleteInterventionResponseDto,
  })
  async delete(
    @Param('id') id: string,
  ): Promise<DeleteInterventionResponseDto> {
    return this.interventionService.deleteInterventionById(id);
  }

  /**

   * Liste les interventions UNPLANNED, filtrables par zone et par jour.
   * - jour: YYYY-MM-DD (Europe/Paris)
   * - zone_id: ID de la zone
   */
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN', 'TECHNICIEN', 'CLIENT')
  @Get('unplanned')
  @ApiOperation({
    summary:
      'Lister les interventions non planifiées (UNPLANNED), filtrables par zone et jour',
  })
  @ApiResponse({
    status: 200,
    description: 'Liste des interventions UNPLANNED',
    type: [InterventionResponseDto],
  })
  async listUnplanned(
    @Query() query: ListUnplannedInterventionsQueryDto,
  ): Promise<InterventionResponseDto[]> {
    return this.interventionService.findUnplanned(query);
  }

  /**
   * Liste les interventions planifiées par jour et par zone ou par technicien.
   * - jour: YYYY-MM-DD (Europe/Paris)
   * - zone_id: ID de la zone
   * - technicien_id: ID du technicien
   */
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN', 'TECHNICIEN', 'CLIENT')
  @Get('planned')
  @ApiOperation({
    summary:
      'Lister les interventions planifiées, filtrables par jour et zone ou technicien',
  })
  @ApiResponse({
    status: 200,
    description: 'Liste des interventions planifiées',
    type: [InterventionResponseDto],
  })
  async listPlanned(
    @Query() query: ListPlannedInterventionsQueryDto,
  ): Promise<InterventionResponseDto[]> {
    return this.interventionService.findPlanned(query);
  }

  /**
   * Liste paginée des interventions d'un client,
   * triées de la plus récente à la plus ancienne.
   */
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN', 'TECHNICIEN', 'CLIENT')
  @Get('client/:id')
  @ApiOperation({
    summary:
      "Lister les interventions d'un client (paginé, tri desc par date début)",
  })
  @ApiParam({ name: 'id', description: 'ID du client' })
  @ApiResponse({
    status: 200,
    description: 'Liste paginée des interventions du client',
    type: PaginatedInterventionsResponseDto,
  })
  async listByClient(
    @Param('id') clientId: string,
    @Query() query: ListClientInterventionsQueryDto,
    @Req() req: Request & { user?: UserType },
  ): Promise<{
    data: InterventionResponseDto[];
    meta: { page: number; limit: number; total: number; totalPages: number };
  }> {
    const user = req.user;
    if (user.role === 'CLIENT' && user.id !== clientId) {
      throw new ForbiddenException(
        "Un client ne peut pas accéder aux interventions d'un autre client.",
      );
    }
    return this.interventionService.findByClientPaginated(clientId, query);
  }
}
