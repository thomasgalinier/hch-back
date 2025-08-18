import { IsDateString, IsIn, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateInterventionDto {
  @ApiPropertyOptional({ description: "Nouvelle date/heure de début", example: '2025-08-06T14:00:00Z', type: String, format: 'date-time' })
  @IsOptional()
  @IsDateString()
  debut?: string;

  @ApiPropertyOptional({ description: "Nouvelle date/heure de fin", example: '2025-08-06T16:00:00Z', type: String, format: 'date-time' })
  @IsOptional()
  @IsDateString()
  fin?: string;

  @ApiPropertyOptional({ description: "Adresse de l'intervention", example: '123 Rue de la Paix, 75001 Paris' })
  @IsOptional()
  @IsString()
  adresse?: string;

  @ApiPropertyOptional({ description: 'Statut', enum: ['UNPLANNED', 'PLANNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'], example: 'PLANNED' })
  @IsOptional()
  @IsIn(['UNPLANNED', 'PLANNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'])
  statut?: 'UNPLANNED' | 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

  @ApiPropertyOptional({ description: 'ID du client', example: 'cm4xkj8p90001xyz123abc456' })
  @IsOptional()
  @IsString()
  client_id?: string;

  @ApiPropertyOptional({ description: 'ID du technicien', example: 'cm4xkj8p90001xyz123abc456' })
  @IsOptional()
  @IsString()
  technicien_id?: string;

  @ApiPropertyOptional({ description: 'ID de la zone', example: 'cm4xkj8p90002xyz789def012' })
  @IsOptional()
  @IsString()
  zone_id?: string;

  @ApiPropertyOptional({ description: "Détails supplémentaires", example: 'Réparation urgente - client disponible toute la journée' })
  @IsOptional()
  @IsString()
  detail?: string;

  @ApiPropertyOptional({ description: 'Mettre à jour le forfait associé', example: 'cm4xkj8p90003xyz345ghi678' })
  @IsOptional()
  @IsString()
  forfait_id?: string;
}
