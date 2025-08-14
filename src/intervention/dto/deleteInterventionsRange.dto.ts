import { ApiProperty } from '@nestjs/swagger';
import { IsDateString } from 'class-validator';

export class DeleteInterventionsRangeDto {
  @ApiProperty({ description: 'Date de début (YYYY-MM-DD) incluse', example: '2025-08-10' })
  @IsDateString()
  date_debut: string;

  @ApiProperty({ description: 'Date de fin (YYYY-MM-DD) incluse', example: '2025-08-20' })
  @IsDateString()
  date_fin: string;
}

export class DeleteInterventionsRangeResponseDto {
  @ApiProperty({ description: "Nombre d'interventions supprimées", example: 12 })
  deletedInterventionsCount: number;

  @ApiProperty({ description: 'Nombre de lignes Forfait_Intervention supprimées', example: 8 })
  deletedForfaitsCount: number;

  @ApiProperty({ description: 'Identifiants des interventions supprimées', type: [String] })
  interventionIds: string[];
}
