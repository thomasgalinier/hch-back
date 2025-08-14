import { Controller, Post, Body, Get, Query, Patch, Param, UseGuards, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBody, ApiParam } from '@nestjs/swagger';
import { InterventionService } from './intervention.service';
import { CreateInterventionDto } from './dto/createIntervention.dto';
import { UpdateInterventionDto } from './dto/updateIntervention.dto';
import { UpdateInterventionStatusDto } from './dto/updateInterventionStatus.dto';
import { RolesGuard } from "../common/middleware/role.middleware";
import { AuthGuard } from "@nestjs/passport";
import { 
  InterventionResponseDto, 
  DisponibiliteResponseDto, 
  CreneauLibreDto 
} from './dto/response.dto';
import { BulkCreateEmptyInterventionsDto, BulkCreateEmptyInterventionsResponseDto } from './dto/bulkCreateEmptyInterventions.dto';
import { DeleteInterventionsRangeDto, DeleteInterventionsRangeResponseDto } from './dto/deleteInterventionsRange.dto';
import { Roles } from 'src/common/decorator/role.decorator';

@ApiTags('intervention')
@Controller('intervention')
export class InterventionController {
  constructor(private readonly interventionService: InterventionService) {}


  /**
   * Création en masse de créneaux d'interventions vides (UNPLANNED) de 1h par défaut
   * pour un technicien et une zone, sur une période fournie (journées entières).
   */
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  @Roles("ADMIN", "SUPER_ADMIN")
  @Post('bulk-empty')
  @ApiOperation({ summary: "Créer des interventions vides sur une plage de dates" })
  @ApiBody({ type: BulkCreateEmptyInterventionsDto })
  @ApiResponse({ status: 201, description: 'Créneaux créés', type: BulkCreateEmptyInterventionsResponseDto })
  async bulkCreateEmpty(@Body() body: BulkCreateEmptyInterventionsDto): Promise<BulkCreateEmptyInterventionsResponseDto> {
    return this.interventionService.bulkCreateEmptyInterventions(body);
  }

  /**
   * Récupère toutes les interventions d'un technicien
   */
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  @Roles("ADMIN", "SUPER_ADMIN", "TECHNICIEN")
  @Get('technicien/:id')
  @ApiOperation({ summary: "Lister les interventions d'un technicien" })
  @ApiParam({ name: 'id', description: 'ID du technicien' })
  @ApiResponse({ status: 200, description: 'Liste des interventions', type: [InterventionResponseDto] })
  async findAllByTechnicien(@Param('id') id: string): Promise<InterventionResponseDto[]> {
    return this.interventionService.findAllByTechnicien(id);
  }

  /**
   * Supprime toutes les interventions d'un technicien sur une plage de jours (inclusifs).
   */
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  @Roles("ADMIN", "SUPER_ADMIN")
  @Delete('technicien/:id')
  @ApiOperation({ summary: "Supprimer les interventions d'un technicien sur une plage de dates" })
  @ApiParam({ name: 'id', description: 'ID du technicien' })
  @ApiBody({ type: DeleteInterventionsRangeDto })
  @ApiResponse({ status: 200, description: 'Résultat de la suppression', type: DeleteInterventionsRangeResponseDto })
  async deleteByTechnicienAndRange(
    @Param('id') id: string,
    @Body() body: DeleteInterventionsRangeDto,
  ): Promise<DeleteInterventionsRangeResponseDto> {
    return this.interventionService.deleteInterventionsByTechnicienAndDateRange(id, body);
  }

  /**
   * Met à jour une intervention
   */
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  @Roles("ADMIN", "SUPER_ADMIN", "TECHNICIEN")
  @Patch(":id")
  @ApiOperation({ summary: "Mettre à jour une intervention" })
  @ApiParam({ name: 'id', description: "ID de l'intervention" })
  @ApiBody({ type: UpdateInterventionDto })
  @ApiResponse({ status: 200, description: "Intervention mise à jour", type: InterventionResponseDto })
  async update(
    @Param('id') id: string,
    @Body() body: UpdateInterventionDto,
  ): Promise<InterventionResponseDto> {
    return this.interventionService.updateIntervention(id, body);
  }

}
